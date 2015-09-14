using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.EnterpriseServices;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using BlackstonePos.Domain.Contracts.Repositories;
using BlackstonePos.Domain.Contracts.Services;
using BlackstonePos.Domain.Exceptions;
using BlackstonePos.Domain.Models;
using BlackstonePos.Domain.Models.Comparers;
using BS.Services.com.blackstoneonline.services;
using BS.Services.Infrastructure;
using Metele.common.Contracts.Services;
using Metele.common.Models;
using Metele.common.Models.PaxTerminal;
using Metele.common.Models.Products.BillPayment;
using Metele.common.Models.Products.DirectTv;
using Metele.common.Models.Products.SunPass;
using Metele.utils.general;
using BillPaymentResponse = Metele.common.Models.Products.BillPayment.BillPaymentResponse;
using Cashier = BlackstonePos.Domain.Models.Cashier;
using MasterBiller = Metele.common.Models.Products.BillPayment.MasterBiller;
using Response = BS.Services.com.blackstoneonline.services.Response;

namespace BS.Services.Contracts_Implementation
{
    public class BlackstonePosService: IBlackstonePosService
    {
        private readonly ICashierRepository _cashierRepository;
        private readonly IMeteleService _meteleService;
        private readonly ISettingRepository _settingsRepository;
        private readonly IAchPaymentRepository _achPaymentRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly ILogRepository _logger;
        private readonly IPromotionsRepository _promotionsRepository;
        private readonly IPaxTerminalPosRepository _paxTerminalPosRepository;
        private readonly IPosMerchantHeader _posMerchantHeader;
        private readonly IFullCargaSmsTemplatesRepository _fullCargaSmsTemplatesRepository;
        private readonly Broker _broker;
        private readonly string _transactionMode;

        public BlackstonePosService(ICashierRepository cashierRepository,
                                    Broker broker,
                                    IAchPaymentRepository achPaymentRepository,
                                    IOrderRepository orderRepository,
                                    ILogRepository logger,
                                    ISettingRepository settngRepository,
                                    IPromotionsRepository promotionsRepository, 
                                    IPaxTerminalPosRepository paxTerminalPosRepository, 
                                    IMeteleService meteleService, 
                                    IPosMerchantHeader posMerchantHeader, 
                                    IFullCargaSmsTemplatesRepository fullCargaSmsTemplatesRepository)
        {
            _cashierRepository = cashierRepository;
            _broker = broker;
            _achPaymentRepository = achPaymentRepository;
            _orderRepository = orderRepository;
            _logger = logger;
            _settingsRepository = settngRepository;
            _promotionsRepository = promotionsRepository;
            _paxTerminalPosRepository = paxTerminalPosRepository;
            _meteleService = meteleService;
            _posMerchantHeader = posMerchantHeader;
            _fullCargaSmsTemplatesRepository = fullCargaSmsTemplatesRepository;
            _transactionMode = TransactionMode.Live;
        }


        #region Repository Ops

        public T GetItem<T>(IBaseRepository<T> repository, int id)
        {
                var itemResult = repository.Get(id);

                return itemResult;
        }

        public T AddItem<T>(IBaseRepository<T> repository, T item)
        {
               var itemResult = repository.Add(item);

                return itemResult;
        }

        public IEnumerable<T> Get<T>(IBaseRepository<T> repository)
        {
                var items = repository.Get();

                return items;
        }

        public bool Delete<T>(IBaseRepository<T> repository, int id)
        {
                var deleteResult = repository.Delete(id);

                return deleteResult;
        }

        public bool Update<T>(IBaseRepository<T> repository, T entity)
        {
                repository.Update(entity);

                return true;
        }

        public Cashier FindCashier(int merchantId, string password)
        {
            var cashierResult = _cashierRepository.FindCashier(merchantId, password);

            return cashierResult;
        }

        public Cashier FindMerchant(int merchantId)
        {
            var cashierResult = _posMerchantHeader.FindGlobalMerchant(merchantId);

            return cashierResult;
        }

        public bool IsBlackstonePosMerchant(int merchantId)
        {
            var isBlackstonePosResult = _cashierRepository.IsBlackstonePosMerchant(merchantId);

            return isBlackstonePosResult;
        }

        public IEnumerable<BlackstonePos.Domain.Models.Promotion> GetAllPromotions(int merchantId)
        {
            var promotions = _promotionsRepository.GetAllPromotions();

            return promotions;
        }

        public DataResponse GetActiveMainProducts(int merchantId)
        {
            var mainProducts = _promotionsRepository.GetActivePosProducts(merchantId);

            return new DataResponse
            {
                Data = mainProducts, 
                ErrorMessage = mainProducts != null? string.Empty: "Could not retrieve Main Products",
                Status = mainProducts != null? 200: 201
            };
        }

        public BlackstonePos.Domain.Models.Setting GetSettings(int merchantId)
        {
            var allsettings = Get(_settingsRepository);

            var setting = allsettings.FirstOrDefault(set => set.MerchantId == merchantId);

            if(setting!= null)
                return setting;

            var merchant = FindMerchant(merchantId);

            //Otherwise a new Merchant has to be added to the Settings Table
            var newSetting = new BlackstonePos.Domain.Models.Setting
            {
                ConfirmPhone = true,
                MerchantId = merchantId,
                PaxTerminalAsPrinter = merchant == null || !merchant.IsFullCarga,
                Tax = 7,
                SmallReceipt = false
            };

            var settingsResponse = _settingsRepository.Add(newSetting);

            return settingsResponse;
        }

        public int FindPayment(string accountNumber, string routingNumber)
        {
            var searchResult = _achPaymentRepository.FindPayment(accountNumber, routingNumber);

            return searchResult;
        }

        public void LogInfo(string controller, string thread,string message, IDictionary<string, object> parameters)
        {
            AddLogWithLevel(controller, thread, "INFO_" + message , null, parameters);
        }

        public void LogInfo(string controller, string thread, string message, string jsonData)
        {
            AddLogWithLevel(controller, thread, "INFO_" + message, null, jsonData);
        }

        public void LogDebug(string controller, string thread, Exception exception)
        {
            //var stackCall = new StackTrace();

            //var callOriginMethod = stackCall.GetFrame(1).GetMethod();

            //var callingMethodName = callOriginMethod.Name;

            //var callingClassName = callOriginMethod.DeclaringType.Name;

            AddLogWithLevel(controller, thread, "DEBUG", exception);
        }

        //private void AddLogWithLevel(string logger, string thread, string level, Exception exception, params object[] parameters)
        //{
        //    var newInfoLog = new Log
        //    {
        //        Date = DateTime.Now,
        //        Level = level,
        //        Message = GetOperationParametersLiteral(parameters),
        //        Logger = logger,
        //        Thread = thread,
        //        Exception = exception != null ? exception.StackTrace : string.Empty
        //    };

        //    _logger.Add(newInfoLog);
        //}

        //public void LogInfo(params object[] parameters)
        //{
        //    var stackCall = new StackTrace();

        //    var callOriginMethod = stackCall.GetFrame(1).GetMethod();

        //    var callingMethodName = callOriginMethod.Name;

        //    var callingClassName = callOriginMethod.DeclaringType.Name;

        //    var thread = string.Format("{0}_{1}", callingMethodName, DateTime.Now.Ticks);

        //    AddLogWithLevel(callingClassName, thread, "INFO", null, parameters);
        //}
        #endregion

        #region Broker Ops

        #region Sunpass

        public DataResponse GetSunpassTransporderInfo(SunpassBalanceInfoRequest sunpassInfoRequest)
        {
            try
            {
                var merchantInfo = FindMerchant(sunpassInfoRequest.MerchantId);

                var balanceResponse = _broker.GetSunPassBalance(merchantInfo.MerchantId, merchantInfo.MerchantTerminalID.ToString(),
                                      merchantInfo.MerchantPassword, merchantInfo.Name, sunpassInfoRequest.TransporderNumber, _transactionMode);

                return new DataResponse
                {
                    Status = balanceResponse.ResponseCode == 0 ? 200 : 201,
                    ErrorMessage = balanceResponse.ResponseDescription,
                    Data = balanceResponse
                };
            }
            catch (Exception exception)
            {
                return new DataResponse(exception);
            }
        }

        public DataResponse GetSunpassDocumentsInfo(DocumentsInquiryRequest documentsInquiry)
        {
            try
            {
                var documentsInquiryResponse = GetSunpassDocumentsInfo(documentsInquiry.MerchantId,
                    documentsInquiry.DocumentId, documentsInquiry.LicensePlate);

                //Setting Product Fee
                //var documentsInfo = _meteleService.GetDocumentsProduct();

                //documentsInquiryResponse.Fee = documentsInfo.Fee != null? documentsInfo.Fee.Value: 0;

                return new DataResponse
                {
                    Status = documentsInquiryResponse.ResponseCode == 0 ? 200 : 201,
                    ErrorMessage = documentsInquiryResponse.ResponseDescription,
                    Data = documentsInquiryResponse
                };
            }
            catch (Exception exception)
            {
                return new DataResponse(exception);
            }
        }

        public DataResponse DoSunpassReplenishment(SunpassReplenishmentRequest sunpassReplenishmentRequest)
        {
            var order = new Order();

            try
            {
                var cashier = _posMerchantHeader.FindGlobalMerchant(sunpassReplenishmentRequest.MerchantId);

                var sunpassProduct = _meteleService.GetSunPassProduct();

                var newOrder = new Order
                {
                    MerchantId = sunpassReplenishmentRequest.MerchantId,
                    TerminalId = cashier.MerchantTerminalID.Value.ToString(),
                    Status = false,
                    Amount = Convert.ToDecimal(sunpassReplenishmentRequest.Amount),
                    ProductMainCode = sunpassProduct.ProductMainCode,
                    TimeStamp = DateTime.Now,
                    ProductCategory = sunpassProduct.ProductCategory
                };

                order = AddItem(_orderRepository, newOrder);

                var merchantSettings = GetSettings(sunpassReplenishmentRequest.MerchantId);

                if (merchantSettings.PaxTerminalAsPrinter)
                {
                    var response = DelayPosProductOrder(sunpassReplenishmentRequest, cashier, order);

                    return response;
                }

                var paxTerminalTransactionRequest = new PaxTerminalTransactionRequest
                {
                    OrderId = order.Id,
                    CashierId = sunpassReplenishmentRequest.MerchantId.ToString(),
                    AccountNumber = sunpassReplenishmentRequest.TransporderNumber,
                    PurchaseId = sunpassReplenishmentRequest.PurchaseId,
                    TotalAmount = sunpassReplenishmentRequest.Amount.ToString()
                };

                return LazyDoSunPass(paxTerminalTransactionRequest);
            }
            catch (Exception exception)
            {
                order.ErrorMessage += string.Format("Error Message: {0}", exception.Message);

                Update(_orderRepository, order);

                return new DataResponse(exception);
            }
      
        }

        public DataResponse DoSunpassDocumentsPayment(DocumentsPaymentRequest documentsRequest)
        {
            var order = new Order();
            try
            {
                var cashierInfo = _posMerchantHeader.FindGlobalMerchant(documentsRequest.MerchantId);

                var settings = GetSettings(documentsRequest.MerchantId);

                var product = _meteleService.GetDocumentsProduct();

                var fee = Convert.ToDouble(product.Fee.HasValue? product.Fee.Value:0);

                var documentInquiryResponse = GetSunpassDocumentsInfo(documentsRequest.MerchantId,
                    documentsRequest.DocumentId, documentsRequest.LicensePlate);

                //At first, and by default, the amount and the document collection is set with the only document that is going to be paid(because it's gonna be included anyways)
                var amount = documentsRequest.PaymentType.Equals(DocumentPaymentType.Single)?
                             documentInquiryResponse.RequestedDocument.DocumentPaymentAmount:
                             documentInquiryResponse.UnpaidDocumentListAmount;

                var newOrder = new Order
                {
                    MerchantId = documentsRequest.MerchantId,
                    TerminalId = cashierInfo.MerchantTerminalID.ToString(),
                    Status = false,
                    Amount = Convert.ToDecimal(amount),
                    ProductMainCode = product.ProductMainCode,
                    TimeStamp = DateTime.Now,
                    ProductCategory = product.ProductCategory
                };

                order = AddItem(_orderRepository, newOrder);

                //Interrupting the proccess to be continued later on
                if (settings.PaxTerminalAsPrinter)
                {
                    var response = DelayPosProductOrder(documentsRequest, cashierInfo, order);

                    return response;
                }

                var paxTransactionRequest = new PaxTerminalTransactionRequest
                {
                    CashierId = documentsRequest.MerchantId.ToString(),
                    OrderId = order.Id,
                    AccountNumber = documentsRequest.DocumentId,
                    LicensePlate = documentsRequest.LicensePlate,
                    PurchaseId = documentInquiryResponse.PurchaseId,
                    PaymentKeyWord = documentsRequest.PaymentType.ToString(),
                    TotalAmount = amount.ToString(),
                    Fee = fee
                };

                return LazyDoSunPassDocumentPayment(paxTransactionRequest);
            }
            catch (Exception exception)
            {
                order.ErrorMessage += string.Format("Error Message: {0}", exception.Message);

                Update(_orderRepository, order);

                return new DataResponse(exception);
            }
        }

        #endregion

        #region Bill Payment
        public DataResponse DoBillPayment(PosBillPaymentRequest posBillPaymentRequest)
        {
            var cashier = FindMerchant(posBillPaymentRequest.MerchantId);

            var cashierInfo = cashier.MapTo<Cashier, GiveCashier>();

            var biller = _meteleService.GetMasterBillerOptionsPos(cashierInfo, posBillPaymentRequest.BillerId);

            AddBillerExtraInfoFromRequest(posBillPaymentRequest, biller);

            var product = _meteleService.GetBillPaymentProduct();

            posBillPaymentRequest.ProductMainCode = product.ProductMainCode;

            var newOrder = _orderRepository.GetNewBillPaymentOrderInstance(posBillPaymentRequest);

            newOrder.ProductCategory = product.ProductCategory;

            newOrder.TerminalId = cashier.MerchantTerminalID.Value.ToString();

            var order = AddItem(_orderRepository, newOrder);

            var merchantSettings = GetSettings(posBillPaymentRequest.MerchantId);

            if (merchantSettings.PaxTerminalAsPrinter)
            {
                var delayResponse = DelayPosProductOrder(posBillPaymentRequest, biller,  cashier, order);

                return delayResponse;
            }

            var transactionRequest = new PaxTerminalTransactionRequest
            {
                CashierId = posBillPaymentRequest.MerchantId.ToString(),
                OrderId = order.Id,
                Fee = posBillPaymentRequest.PaymentFee
            };

            return LazyDoBillPayment(biller, transactionRequest);
        }

        public DataResponse DoBillPaymentNextStep(PosBillPaymentRequest posBillPaymentRequest)
        {
            var cashier = FindMerchant(posBillPaymentRequest.MerchantId);

            var cashierInfo = cashier.MapTo<Cashier, GiveCashier>();

            var biller = _meteleService.GetMasterBillerOptionsPos(cashierInfo, posBillPaymentRequest.BillerId);

            var errorMessage = string.Empty;

            if (biller.HasPresentment)
            {
                BillPaymentResponse response;

                if (!_meteleService.DoBillPaymentPresentmentPos(cashierInfo, biller, posBillPaymentRequest.PaymentFee, out response))
                {
                    errorMessage = !string.IsNullOrEmpty(response.ProviderMessage)
                        ? response.ProviderMessage :
                         response.ResultMessage;
                }
            }
            return new DataResponse
            {
                Data = biller,
                ErrorMessage = errorMessage,
                Status = string.IsNullOrEmpty(errorMessage) ? 200 : 201
            };
        }

        #endregion

        #region Direct TV
        public DataResponse GetDirectTvCategories()
        {
            var directTvCategories = _meteleService.GetDirectTvCategories();

            var categoriesResult = directTvCategories.Where(c=> HasDirectTvProducts(c.CategoryValue));

            return new DataResponse
            {
                Data = categoriesResult, 
                Status = directTvCategories!= null? (int)RequestStatus.Ok: (int)RequestStatus.KnownErrors,
                ErrorMessage = directTvCategories!= null? string.Empty: "Error trying to retrieve Direct TV Categories."
            };
        }

        private bool HasDirectTvProducts(int category)
        {
            var products = _meteleService.GetDirectTvProducts(category);

            return products != null && products.Any();
        }

        public DataResponse GetDirectTvProductsByCategory(int category)
        {
            var directTvProducts = _meteleService.GetDirectTvProducts(category);

            return new DataResponse
            {
                Data = directTvProducts,
                Status = directTvProducts != null ? (int)RequestStatus.Ok : (int)RequestStatus.KnownErrors,
                ErrorMessage = directTvProducts != null ? string.Empty : "Error trying to retrieve Direct TV Products."
            };
        }

        public DataResponse GetDirectTvProduct(int productId)
        {
            var directTvProducts = GetAllDirectTvProducts();

            var directTvProduct = directTvProducts.FirstOrDefault(p => p.id == productId);

            return new DataResponse
            {
                Data = directTvProduct,
                Status = directTvProduct != null ? (int)RequestStatus.Ok : (int)RequestStatus.KnownErrors,
                ErrorMessage = directTvProduct != null ? string.Empty : "Error trying to retrieve Direct TV Product."
            };
        }

        public DataResponse GetDirectTvAllProducts()
        {
            var allProducts = GetAllDirectTvProducts();

            return new DataResponse
            {
                Data = allProducts,
                Status = allProducts != null ? (int)RequestStatus.Ok : (int)RequestStatus.KnownErrors,
                ErrorMessage = allProducts != null ? string.Empty : "Error trying to retrieve Direct TV Products."
            };
        }

        

        private IEnumerable<DirectTvProduct> GetAllDirectTvProducts()
        {
            var directTvProducts = new List<DirectTvProduct>();
            var directTvCategories = _meteleService.GetDirectTvCategories();
            foreach (var directTvCategory in directTvCategories)
            {
                var directTvProductsByCategory = _meteleService.GetDirectTvProducts(directTvCategory.CategoryValue);
                directTvProducts.AddRange(directTvProductsByCategory);
            }
            return directTvProducts;
        }

        #endregion

        #region General Products

        public DataResponse GetSinglePin(PosRequest singlePinRequest)
        {
            var merchantInfo = FindMerchant(singlePinRequest.MerchantId);

            var newOrder = _orderRepository.GetNewSinglePinOrderInstance(singlePinRequest);

            var product = getProduct(singlePinRequest.MerchantId, singlePinRequest.ProductMainCode);

            if (product != null)
                newOrder.ProductCategory = product.MainCategory;

            newOrder.TerminalId = merchantInfo.MerchantTerminalID.Value.ToString();

            var order = AddItem(_orderRepository, newOrder);

            var merchantSettings = GetSettings(singlePinRequest.MerchantId);

            if (merchantSettings.PaxTerminalAsPrinter)
            {
                var response = DelayPosProductOrder(singlePinRequest, merchantInfo,order);
                
                return response;
            }

            return LazyGetSinglePin(new PaxTerminalTransactionRequest{OrderId = order.Id});
        }

        public DataResponse DoTopUp(PosRequest topUpRequest)
        {
            var merchantInfo = FindMerchant(topUpRequest.MerchantId);

            var newOrder = _orderRepository.GetNewTopUpOrderInstance(topUpRequest);

            var product = getProduct(topUpRequest.MerchantId, topUpRequest.ProductMainCode);

            if (product != null)
                newOrder.ProductCategory = product.MainCategory;

            newOrder.TerminalId = merchantInfo.MerchantTerminalID.Value.ToString();

            var order = AddItem(_orderRepository, newOrder);

            var merchantSettings = GetSettings(topUpRequest.MerchantId);

            if (merchantSettings.PaxTerminalAsPrinter)
            {
                if (merchantSettings.PaxTerminalAsPrinter)
                {
                    var response = DelayPosProductOrder(topUpRequest, merchantInfo, order);

                    return response;
                }
            }

            return LazyDoTopUpWithFee(new PaxTerminalTransactionRequest { OrderId = order.Id, ProductId = product.Code}, topUpRequest.AdditionalPhones);
        }

        public DataResponse GetProducts(int merchantId, string terminalId, string password, string operatorName)
        {
            try
            {
                var products = getProducts(merchantId, terminalId, password, operatorName);


                var productsResult = products.ToList();

                productsResult.ForEach(p => p.MainCategory = GetProductCategory(p).ToString());

                var status = products != null ? 200 : 201;

                var errorMessage = products != null ? string.Empty : "Could not retrieve products.";

                return new DataResponse
                {
                    Data = products,
                    Status = status,
                    ErrorMessage = errorMessage
                };

            }
            catch (Exception exception)
            {
                return new DataResponse(exception);
            }
        }

        public DataResponse GetProducts(int merchantId, string terminalId, string password, string operatorName, string category, int count = 0)
        {
            try
            {
                Func<IEnumerable<string>> getDomain = () => new List<string>();

                switch (category.ToLower())
                {
                    case "international":
                        {
                            getDomain = InternationalCategory;
                            break;
                        }
                    case "pinless":
                        {
                            getDomain = PinlessCategory;
                            break;
                        }
                    case "longdistance":
                        {
                            getDomain = LongDistanceCategory;
                            break;
                        }
                    case "wireless":
                        {
                            getDomain = WirelessCategory;
                            break;
                        }
                }

                var products = getProducts(merchantId, terminalId, password, operatorName, getDomain);

                var productsResult = products.ToList();

                var productsTaken = count == 0
                    ? productsResult
                    : productsResult.Take(Math.Min(count, productsResult.Count)).ToList();

                productsTaken.ForEach(p => p.MainCategory = category);

                var status = products != null ? 200 : 201;

                var errorMessage = products != null ? string.Empty : "Could not retrieve products.";

                return new DataResponse
                {
                    Data = productsTaken,
                    Status = status,
                    ErrorMessage = errorMessage
                };

            }
            catch (Exception exception)
            {
                return new DataResponse(exception);
            }

        }

        public DataResponse GetProductRates(int merchantId, string terminalId, string password, string operatorName, string productMainCode)
        {
                var transactionId = Utils.GetTransactionId();

                var productRatesResponse = _broker.GetProductRates(merchantId.ToString(), terminalId, password, operatorName, productMainCode, transactionId);

                var rates = productRatesResponse.Rates;

                var status = rates != null ? 200 : 201;

                var errorMessage = rates != null ? string.Empty : "Could not retrieve rates.";

                var data = rates;

                return new DataResponse
                {
                    Data = data,
                    ErrorMessage = errorMessage,
                    Status = status
                };


        }

        public DataResponse GetMostSoldProducts(int merchantId, string terminalId, string password, string operatorName, string category, int? amount)
        {
                var count = amount ?? 5;

                var productsResponse = GetProducts(merchantId, terminalId, password, operatorName, category);

                var products = (productsResponse.Data as IEnumerable<ProductItem>).ToList();

                products.Sort((a, b) =>
                {
                    var buyingFrequencyA = a.MerchantBuyingFrequency;
                    var buyingFrequencyB = b.MerchantBuyingFrequency;

                    return buyingFrequencyA != buyingFrequencyB
                        ? buyingFrequencyB.CompareTo(buyingFrequencyA)
                        : b.ZipCodeBuyingFrequency.CompareTo(a.ZipCodeBuyingFrequency);
                });

                var elementsToTake = Math.Min(products.Count, count);

                var result = products.Take(elementsToTake);

                var productsResult = products.ToList();

                productsResult.ForEach(p => p.MainCategory = category);

                return new DataResponse
                {
                    Data = result,
                    Status = 200,
                    ErrorMessage = string.Empty
                };
        }

        public DataResponse GetProductDenominations(string merchantId, string terminalId, string password,string operatorName, string productMainCode)
        {
            var transactionId = Utils.GetTransactionId();

            var products = _broker.GetProductList(merchantId, terminalId, password, operatorName, transactionId);

            var productDenominations = products.Products.FirstOrDefault(p => p.Code == productMainCode);

            var denominations = productDenominations.Denominations;

            return new DataResponse
            {
                Data = denominations,
                ErrorMessage = denominations!=null?string.Empty: "Could not retrieve denominations",
                Status = denominations!=null? 200:201
            };
        }

        public DataResponse GetProduct(int merchantId, string terminalId, string password, string operatorName, string productMainCode)
        {
            try
            {
                var transactionId = Utils.GetTransactionId();

                var productByMainCodeResponse = _broker.GetProductListByProductMainCode(merchantId.ToString(),
                    terminalId, password, operatorName, transactionId, productMainCode);

                var productResult = productByMainCodeResponse.Products.FirstOrDefault();

                var product = productResult.MapTo<ProductListItem, ProductItem>();

                if (product != null) //Completing the Product Main Category
                {
                    var productCategory = GetProductCategory(product);

                    product.MainCategory = productCategory.ToString();
                }

                var status = product != null ? 200 : 201;

                var message = product != null ? string.Empty : "Product could not be retrieved.";

                return new DataResponse
                {
                    Data = product,
                    Status = status,
                    ErrorMessage = message
                };

            }
            catch (Exception exception)
            {
                return new DataResponse(exception);
            }
        }

        public DataResponse GetProduct(int merchantId, string productMainCode)
        {
            var merchantInfo = FindMerchant(merchantId);

            return GetProduct(merchantId, merchantInfo.MerchantTerminalID.ToString(), merchantInfo.MerchantPassword,
                merchantInfo.Name, productMainCode);
        }

        public DataResponse GetCarriers(int merchantId, string terminalId, string password, string operatorUsername, string category)
        {
                var productsResponse = GetProducts(merchantId, terminalId, password, operatorUsername, category);

                var products = (productsResponse.Data as IEnumerable<ProductItem>).ToList();

                var carriers = products.Select(a => a.CarrierName).Distinct();

                return new DataResponse
                {
                    Data = carriers,
                    Status = 200,
                    ErrorMessage = string.Empty
                };
        }

        public DataResponse GetProductsByCarrier(int merchantId, string terminalId, string password, string operatorUsername, string category, string carrierName)
        {
                var allProducts = GetProducts(merchantId, terminalId, password, operatorUsername, category);

                var products = allProducts as IEnumerable<ProductListItem>;

                var carriers = products.Where(p => p.CarrierName == carrierName);

                return new DataResponse
                {
                    Data = carriers,
                    Status = 200,
                    ErrorMessage = string.Empty
                };
        }

        public DataResponse GetProductsByCountry(int merchantId, string terminalId, string password, string operatorUsername, string category, string countryCode)
        {
                var allProducts = GetProducts(merchantId, terminalId, password, operatorUsername, category);

                var products = (allProducts as IEnumerable<ProductListItem>).ToList();

                var productsResut = products.Where(p => p.CountryCode == countryCode).Distinct();

                return new DataResponse
                {
                    Data = productsResut,
                    Status = 200,
                    ErrorMessage = string.Empty
                };

        }

        public DataResponse GetSavedPayments(string merchantId)
        {
            var savedPayments = _achPaymentRepository.GetAchSavedPayments(merchantId);

            return new DataResponse
            {
                Data = savedPayments,
                ErrorMessage = string.Empty,
                Status = 200
            };
        }

        //public PaymentOperationResult AddFoundsUsingNonCreditPayment(NonCreditPayment payment)
        //{
        //    try
        //    {
        //        var paymentResponse = AddFoundsUsingNonCreditPaymentBsPos(payment);

        //        return paymentResponse;

        //    }
        //    catch (Exception exception)
        //    {
        //        return null;
        //    }
        //}

        public DataResponse GetProductAccessNumbers(int merchantId, string terminalId, string password, string operatorName, string productMainCode)
        {
            var transactionId = Utils.GetTransactionId();

            var productListResponse = _broker.GetProductList(merchantId.ToString(), terminalId, password, operatorName, transactionId);

            var productList = productListResponse.Products;

            var product = productList.FirstOrDefault(p => p.Code == productMainCode);

            var accessNumbers = product.AccessPhones;

            var status = accessNumbers != null ? 200 : 201;

            var errorMessage = accessNumbers != null ? string.Empty : "Could not retrieve access numbers.";

            var data = accessNumbers;

            return new DataResponse
            {
                Data = data,
                ErrorMessage = errorMessage,
                Status = status
            };
        }

        public DataResponse GetCarriersInitials(int merchantId, string terminalId, string password, string operatorUsername, string category)
        {
            var productsResponse = GetProducts(merchantId, terminalId, password, operatorUsername, category);

            var products = (productsResponse.Data as IEnumerable<ProductItem>).ToList();

            var carriers = products.Select(a => a.CarrierName.Substring(0, 1)).Distinct();

            return new DataResponse
            {
                Data = carriers,
                ErrorMessage = carriers != null ? string.Empty : "Could not retrieve carriers initials",
                Status = carriers != null ? 200 : 201
            };
        }

        #region Delay Orders

        private DataResponse DelayPosProductOrder(SunpassReplenishmentRequest request, Cashier cashier, Order order)
        {
            var product = _meteleService.GetSunPassProduct();
            var fee = product.Fee.HasValue? product.Fee.Value: 0;

            var posTransactionRequest = new PaxTerminalTransactionRequest
            {
                ProductId = product.ProductMainCode,
                ProductName = product.ProductName,
                Type = (int)ProductType.SunpassReplenishment,
                Country = product.CountryCode,
                OrderId = order.Id,
                OrderDate = order.TimeStamp != null ? order.TimeStamp.Value : DateTime.Now,
                CashierId = cashier.MerchantId.ToString(),
                Fee = Convert.ToDouble(fee),
                TotalAmount = order.Amount.ToString(),
                AccountNumber = request.TransporderNumber,
                PurchaseId = request.PurchaseId
            };
     
            _paxTerminalPosRepository.AddPosPaxTerminalOrderRequest(posTransactionRequest);
            _paxTerminalPosRepository.AddPosPaxTerminalPendingOrder(cashier.MerchantId, cashier.MerchantTerminalID.Value, order.Id);

            var receiptResponse = GetReceiptResponseForDelayedOrder(cashier, order, product.ProductMainCode , fee);

            var response = new DataResponse
            {
                Data = receiptResponse,
                ErrorMessage = receiptResponse != null ? string.Empty : "Order could not be delayed at this time!",
                Status = receiptResponse != null ? (int)RequestStatus.PaxTerminal : 201
            };

            return response;
        }

        private DataResponse DelayPosProductOrder(PosBillPaymentRequest request, MasterBiller biller,  Cashier cashier, Order order)
        {
            var product = _meteleService.GetBillPaymentProduct();
           
            var posTransactionRequest = new PaxTerminalTransactionRequest
            {
                ProductId = product.ProductMainCode,
                ProductName = product.ProductName,
                Type = (int)ProductType.BillPayment,
                Country = product.CountryCode,
                OrderId = order.Id,
                OrderDate = order.TimeStamp != null ? order.TimeStamp.Value : DateTime.Now,
                CashierId = cashier.MerchantId.ToString(),
                Fee = request.PaymentFee,
                TotalAmount = order.Amount.ToString(),
                AccountNumber = request.AccountNumber,
                AddInfo1 = request.AddInfo1,
                AddInfo2 = request.AddInfo2,
                AltAccountNumber = request.AltLookUp,
                SenderName = request.SenderName,
                VendorId = request.BillerId,
                VendorPaymentType = biller.PaymentType
            };

            _paxTerminalPosRepository.AddPosPaxTerminalOrderRequest(posTransactionRequest);
            _paxTerminalPosRepository.AddPosPaxTerminalPendingOrder(cashier.MerchantId, cashier.MerchantTerminalID.Value, order.Id);

            var receiptResponse = GetReceiptResponseForBillPaymentDelayedOrder(cashier, order, Convert.ToDecimal(request.PaymentFee));

            var response = new DataResponse
            {
                Data = receiptResponse,
                ErrorMessage = receiptResponse != null ? string.Empty : "Order could not be delayed at this time!",
                Status = receiptResponse != null ? (int)RequestStatus.Ok : 201
            };

            return response;
        }

        private DataResponse DelayPosProductOrder(DocumentsPaymentRequest request, Cashier cashier, Order order)
        {
            var product = _meteleService.GetSunPassProduct();
            
            var fee = product.Fee.HasValue? product.Fee.Value: 0;

            var posTransactionRequest = new PaxTerminalTransactionRequest
            {
                ProductId = product.ProductMainCode,
                ProductName = product.ProductName,
                Type = (int)ProductType.SunpassDocument,
                Country = product.CountryCode,
                OrderId = order.Id,
                OrderDate = order.TimeStamp != null ? order.TimeStamp.Value : DateTime.Now,
                CashierId = cashier.MerchantId.ToString(),
                Fee = Convert.ToDouble(fee),
                TotalAmount = order.Amount.ToString(),
                AccountNumber = request.DocumentId,
                LicensePlate = request.LicensePlate,
                PaymentKeyWord = request.PaymentType.ToString(),
                HasSunPassDocuments = true
            };

            _paxTerminalPosRepository.AddPosPaxTerminalOrderRequest(posTransactionRequest);
            _paxTerminalPosRepository.AddPosPaxTerminalPendingOrder(cashier.MerchantId, cashier.MerchantTerminalID.Value, order.Id);

            var receiptResponse = GetReceiptResponseForDelayedOrder(cashier, order, product.ProductMainCode,fee);

            var response = new DataResponse
            {
                Data = receiptResponse,
                ErrorMessage = receiptResponse != null ? string.Empty : "Order could not be delayed at this time!",
                Status = receiptResponse != null ? (int)RequestStatus.PaxTerminal : 201
            };

            return response;
        }

        private DataResponse DelayPosProductOrder(PosRequest posRequest, Cashier cashier, Order order)
        {
            var product = GetProductByMainCode(posRequest.MerchantId, posRequest.ProductMainCode);

            var fee = 0;

            var posTransactionRequest = new PaxTerminalTransactionRequest
            {
                ProductId = posRequest.ProductMainCode,
                ProductName = product.Name,
                PhoneNumber = posRequest.PhoneNumber,
                Type = product.IsTopUp ? (int)ProductType.TopUp : (int)ProductType.SinglePin,
                Country = posRequest.CountryCode,
                OrderId = order.Id,
                OrderDate = order.TimeStamp != null ? order.TimeStamp.Value : DateTime.Now,
                CashierId = cashier.MerchantId.ToString(),
                Fee = fee,
                TotalAmount = order.Amount.ToString(),
                HasAccessNumbers = product.ShowAccessNumbers
            };

            _paxTerminalPosRepository.AddPosPaxTerminalOrderRequest(posTransactionRequest);
            _paxTerminalPosRepository.AddPosPaxTerminalPendingOrder(cashier.MerchantId, cashier.MerchantTerminalID.Value, order.Id);

            var receiptResponse = GetReceiptResponseForDelayedOrder(cashier, order, product.Code, fee);

            var response = new DataResponse
            {
                Data = receiptResponse,
                ErrorMessage = receiptResponse != null ? string.Empty : "Order could not be delayed at this time!",
                Status = receiptResponse != null ? (int)RequestStatus.PaxTerminal : 201
            };

            return response;
        }

        private ReceiptResponse GetReceiptResponseForDelayedOrder(Cashier cashier, Order order, string productMainCode, decimal fee)
        {
            var product = GetProductByMainCode(cashier.MerchantId, productMainCode);

            var amount = order.Amount.HasValue ? order.Amount.Value : 0;

            var taxCalculated = CalculateTaxForMerchant(cashier.MerchantId, amount);

            var receiptResponse = new ReceiptResponse
            {
                ProductName = string.Format("{0} (Order Pending for Pax Terminal Execution.)", product.Name),
                ProductCountry = product.CountryName,
                CarrierName = product.CarrierName,
                Amount = order.Amount.HasValue? order.Amount.Value: 0,
                CashierName = cashier.Name,
                Tax = Convert.ToDecimal(taxCalculated),
                Fee = fee,
                OrderDate = DateTime.Now,
                OrderNumber = order.Id,
                MerchantName = cashier.MerchantBusinessName,
                MerchantAddress = cashier.MerchantBusinessAddress,
                MerchantPhoneNumber = cashier.MerchantBusinessPhone
            };

            return receiptResponse;
        }

        private ReceiptResponse GetReceiptResponseForBillPaymentDelayedOrder(Cashier cashier, Order order, decimal fee)
        {
            var amount = order.Amount.HasValue ? order.Amount.Value : 0;

            var taxCalculated = CalculateTaxForMerchant(cashier.MerchantId, amount);

            var receiptResponse = new ReceiptResponse
            {
                ProductName = string.Format("{0} (Order Pending for Pax Terminal Execution.)", "Bill Payment"),
                ProductCountry = "United States",
                CarrierName = order.BillerId,
                Amount = order.Amount.HasValue ? order.Amount.Value : 0,
                CashierName = cashier.Name,
                Tax = Convert.ToDecimal(taxCalculated),
                Fee = fee,
                OrderDate = DateTime.Now,
                OrderNumber = order.Id,
                MerchantName = cashier.MerchantBusinessName,
                MerchantAddress = cashier.MerchantBusinessAddress,
                MerchantPhoneNumber = cashier.MerchantBusinessPhone
            };

            return receiptResponse;
        }

        #endregion
   
        #endregion

        #endregion

        #region Aux Ops

        private DocumentInquiryResponse GetSunpassDocumentsInfo(int merchantId, string documentId, string licensePlate)
        {
            var merchantInfo = FindMerchant(merchantId);

            var documentsInquiryResponse = _broker.DoSunPassDocumentInquiry(merchantInfo.MerchantId, merchantInfo.MerchantTerminalID.ToString(), merchantInfo.MerchantPassword,
                                           merchantInfo.Name, documentId,licensePlate, _transactionMode);
            return documentsInquiryResponse;
        }

        private IEnumerable<ProductAccessPhone> GetProductAccessNumbers(int merchantId, string productMainCode)
        {
            var merchantInfo = FindMerchant(merchantId);

            var response = GetProductAccessNumbers(merchantId, merchantInfo.MerchantTerminalID.ToString(),
                merchantInfo.MerchantPassword, merchantInfo.Name, productMainCode);

            var accessNumbers = response.Data as IEnumerable<ProductAccessPhone>;

            return accessNumbers;
        }

        private ProductItem GetProductByMainCode(int merchantId, string productMainCode)
        {
            try
            {
                var product = GetProduct(merchantId, productMainCode);

                var productData = product.Data as ProductItem;

                return productData;
            }
            catch (Exception exception)
            {
                return null;
            }
        }

        private IEnumerable<ProductItem> getProducts(int merchantId, string terminalId, string password, string operatorName, Func<IEnumerable<string>> getDomain = null)
        {
                var transactionId = Utils.GetTransactionId();

                var productListResponse = _broker.GetProductList(merchantId.ToString(), terminalId, password, operatorName, transactionId);

                var productList = productListResponse.Products;

                var productsResult = getDomain != null
                    ? productList.Where(p => p.Type.BelongsToCategory(getDomain))
                    : productList;

                var resultMapped = productsResult.MapTo<IEnumerable<ProductListItem>, IEnumerable<ProductItem>>().Distinct(new ProductItemComparer()).ToList();
                
            //Sorting by buying frequency (Not used to improve performance)
                //resultMapped.Sort((a, b) =>
                //{
                //    var buyingFrequencyA = a.MerchantBuyingFrequency;
                //    var buyingFrequencyB = b.MerchantBuyingFrequency;

                //    return buyingFrequencyA != buyingFrequencyB
                //        ? buyingFrequencyB.CompareTo(buyingFrequencyA)
                //        : b.ZipCodeBuyingFrequency.CompareTo(a.ZipCodeBuyingFrequency);
                //});
               
                return resultMapped;

        }

        private ProductItem getProduct(int merchantId, string productMainCode)
        {
            try
            {
                var productResponse = GetProduct(merchantId, productMainCode);

                return productResponse.Data as ProductItem;

            }
            catch (Exception exception)
            {
                return null;
            } 
        }

        private PosCategory GetProductCategory(ProductItem product)
        {
            var type = product.Type;

            var domains = new Dictionary<PosCategory,Func<IEnumerable<string>>>(){ {PosCategory.wireless, WirelessCategory}, 
                                                                                   {PosCategory.longdistance, LongDistanceCategory}, 
                                                                                   {PosCategory.pinless, PinlessCategory},
                                                                                   {PosCategory.international, InternationalCategory}};

             var domain = domains.FirstOrDefault(d=> type.BelongsToCategory(d.Value));

             return domain.Value != null? domain.Key: default(PosCategory);
        }

        private void AddLogWithLevel(string logger, string thread, string level, Exception exception, IEnumerable<KeyValuePair<string, object>> parameters = null)
        {
            try
            {
                var newInfoLog = new Log
                {
                    Date = DateTime.Now,
                    Level = level,
                    Message = GetOperationParametersLiteral(parameters),
                    Logger = logger,
                    Thread = thread,
                    Exception = exception != null ? exception.StackTrace : string.Empty
                };

                _logger.Add(newInfoLog);
            }
            catch (Exception e)
            {
               return;
            }
            
        }

        private void AddLogWithLevel(string logger, string thread, string level, Exception exception, string message)
        {
            try
            {
                var newInfoLog = new Log
                {
                    Date = DateTime.Now,
                    Level = level,
                    Message = message,
                    Logger = logger,
                    Thread = thread,
                    Exception = exception != null ? exception.StackTrace : string.Empty
                };

                _logger.Add(newInfoLog);
            }
            catch (Exception e)
            {
                return;
            }

        }

        private string GetOperationParametersLiteral(IEnumerable<KeyValuePair<string, object>> parameters)
        {
            var messageResult = string.Empty;

            try
            {
                foreach (var parameter in parameters)
                {
                    var parameterName = parameter.Key;

                    var parameterValue = parameter.Value;

                    var literal = GetParameterLiteral(parameterName, parameterValue);

                    messageResult += literal;
                }

                return messageResult;
            }
            catch (Exception exception)
            {
                return string.Empty;
            }
        }

        private static string GetParameterLiteral(string parameterName, object parameter)
        {

            var parameterType = parameter.GetType();
            var properties = parameterType.GetProperties();

            var messageResult = parameterType.IsSimpleType() ? GetMessageResultForValueType(parameterName, parameter) :
                                                  GetMessageResultForReferenceType(parameter, properties);
            return messageResult;
        }

        private static string GetMessageResultForReferenceType(object parameter, IEnumerable<PropertyInfo> properties)
        {
            var messageResult = string.Empty;
            foreach (var propertyInfo in properties)
            {
                var parameterValue = propertyInfo.GetValue(parameter, null);

                if (parameterValue != null)
                    messageResult += "{" + propertyInfo.Name + "," + parameterValue + "}";
            }

            return messageResult;
        }

        private static string GetMessageResultForValueType(string parameterName, object parameter)
        {
            var messageResult = "{" + parameterName + "," + parameter + "}";

            return messageResult;
        }

        private void AddBillerExtraInfoFromRequest(PosBillPaymentRequest posBillPaymentRequest, MasterBiller biller)
        {
            biller.Amount = posBillPaymentRequest.Amount;
            biller.Fee = posBillPaymentRequest.PaymentFee;
            biller.AccountNumber = posBillPaymentRequest.AccountNumber;
            biller.CustomerName = posBillPaymentRequest.CustomerName;
            biller.SenderName = posBillPaymentRequest.SenderName;
            biller.AltLookUp = posBillPaymentRequest.AltLookUp;
            biller.AddInfo1 = posBillPaymentRequest.AddInfo1;
            biller.AddInfo2 = posBillPaymentRequest.AddInfo2;
        }

        private void AddBillerExtraInfoFromRequest(PaxTerminalTransactionRequest paxTerminalTransactionRequest, MasterBiller biller)
        {
            biller.Amount = double.Parse(paxTerminalTransactionRequest.TotalAmount);
            biller.Fee = paxTerminalTransactionRequest.Fee;
            biller.AccountNumber = paxTerminalTransactionRequest.AccountNumber;
            biller.CustomerName = paxTerminalTransactionRequest.CustomerName;
            biller.SenderName = paxTerminalTransactionRequest.SenderName;
            biller.AltLookUp = paxTerminalTransactionRequest.AltAccountNumber;
            biller.AddInfo1 = paxTerminalTransactionRequest.AddInfo1;
            biller.AddInfo2 = paxTerminalTransactionRequest.AddInfo2;
        }

        private Order MapPinToOrder(Order order, PIN pin)
        {
            order.AuthorizationCode = pin.AuthorizationCode;
            order.ErrorMessage = pin.ErrorMessage;
            order.TransactionID = int.Parse(pin.TransactionID);
            order.ControlNumber = pin.ControlNumber;
            order.PinID = pin.PinID;
            order.PinNumber = pin.PinNumber;

            return order;
        }

        #region Receipt Responses

        public ReceiptResponse GetReceiptResponse(PaxTerminalTransactionRequest request, BrokerResponse brokerResponse)
        {
            var order = _orderRepository.Get(request.OrderId);

            var merchantId = order.MerchantId;

            var merchantInfo = _posMerchantHeader.FindGlobalMerchant(merchantId);

            var productInfo = GetProductByMainCode(merchantId, order.ProductMainCode);

            var merchantSettings = GetSettings(merchantId);

            var amount = order.Amount.HasValue? order.Amount.Value: 0;

            var tax = (amount * merchantSettings.Tax) / 100;

            var receiptResponse = new ReceiptResponse
            {
                ProductName = productInfo.Name,
                ProductCountry = productInfo.CountryName,
                CarrierName = productInfo.CarrierName,
                Amount = amount,
                PhoneNumber = order.PhoneNumber,
                //ControlNumber = brokerResponse.ControlNumber,
                //TransactionId = brokerResponse.TransactionID,
                ControlNumber = order.ControlNumber,
                TransactionId = order.PinID,
                CashierName = merchantInfo.Name,
                Tax = tax,
                OrderDate = DateTime.Now,
                //OrderNumber = brokerResponse.OrderNumber,
                //PinNumber = brokerResponse.PinNumber,
                OrderNumber = order.Id,
                PinNumber = order.PinNumber,
                MerchantName = merchantInfo.MerchantBusinessName,
                MerchantAddress = merchantInfo.MerchantBusinessAddress,
                MerchantPhoneNumber = merchantInfo.MerchantBusinessPhone,
                LocalPhones = brokerResponse.LocalAccessPhones,
                ExpirationDate = brokerResponse.ExpirationDate,
                CustomerService = brokerResponse.CustomerService
            };

            

            return receiptResponse;
        }

        private ReceiptResponse GetSunPassReceiptResponse(PaxTerminalTransactionRequest request, ReplenishmentResponse brokerResponse)
        {
            var merchantId = int.Parse(request.CashierId);
         
            var amount = decimal.Parse(request.TotalAmount);

            var merchantSettings = GetSettings(merchantId);

            var tax = (amount * merchantSettings.Tax) / 100;

            var sunpassProduct = _meteleService.GetSunPassProduct();

            var merchant = _posMerchantHeader.FindGlobalMerchant(merchantId);

            var receiptResponse = new ReceiptResponse
            {
                ProductName = sunpassProduct.ProductName,
                ProductCountry = sunpassProduct.CountryName,
                CarrierName = sunpassProduct.Description,
                Amount = amount,
                TransactionId = brokerResponse.ReferenceNumber.ToString(),
                CashierName = merchant.Name,
                Tax = tax,
                Fee = sunpassProduct.Fee != null ? sunpassProduct.Fee.Value : 0,
                OrderDate = DateTime.Now,
                OrderNumber = request.OrderId,
                UpdatedBalance = brokerResponse.UpdatedBalance,
                AccountNumber = request.AccountNumber,
                ProductInstructions = sunpassProduct.Instructions,
                MerchantName = merchant.MerchantBusinessName,
                MerchantAddress = merchant.MerchantBusinessAddress,
                MerchantPhoneNumber = merchant.MerchantBusinessPhone,
            };

            return receiptResponse;
        }

        private ReceiptResponse GetDocumentsPaymentReceiptResponse(PaxTerminalTransactionRequest request, DocumentPaymentResponse brokerResponse)
        {
            var merchantId = int.Parse(request.CashierId);

            var amount = decimal.Parse(request.TotalAmount);

            var merchantSettings = GetSettings(merchantId);

            var tax = (amount * merchantSettings.Tax) / 100;

            var documentsProduct = _meteleService.GetDocumentsProduct();

            var merchant = _posMerchantHeader.FindGlobalMerchant(merchantId);

            var receiptResponse = new ReceiptResponse
            {
                ProductName = documentsProduct.ProductName,
                ProductCountry = documentsProduct.CountryName,
                CarrierName = documentsProduct.Description,
                TransactionId = brokerResponse.ReferenceNumber.ToString(),
                CashierName = merchant.Name,
                Amount = amount,
                Tax = tax,
                Fee = documentsProduct.Fee!= null? documentsProduct.Fee.Value: 0,
                OrderDate = DateTime.Now,
                OrderNumber = request.OrderId,
                UpdatedBalance = brokerResponse.UpdatedBalance.ToString(),
                LicensePlate = request.LicensePlate,
                ProductInstructions = documentsProduct.Instructions,
                MerchantName = merchant.MerchantBusinessName,
                MerchantAddress = merchant.MerchantBusinessAddress,
                MerchantPhoneNumber = merchant.MerchantBusinessPhone,
            };

            return receiptResponse;
        }

        private ReceiptResponse GetBillPaymentReceiptResponse(PaxTerminalTransactionRequest request, BillPaymentResponse billPaymentResponse)
        {
            var merchantInfo = _posMerchantHeader.FindGlobalMerchant(int.Parse(request.CashierId));

            var merchantSettings = GetSettings(int.Parse(request.CashierId));

            var tax = Convert.ToDouble(merchantSettings.Tax);

            var amount = double.Parse(request.TotalAmount);

            var taxCalculated = (amount * tax) / 100;

            var receiptResponse = new ReceiptResponse
            {
                ProductName = "Bill Payment",
                ProductCountry = "United States",
                CarrierName = request.VendorId,
                Amount = Convert.ToDecimal(amount),
                CashierName = merchantInfo.Name,
                Tax = Convert.ToDecimal(taxCalculated),
                Fee = billPaymentResponse.Fee != null ? decimal.Parse(billPaymentResponse.Fee) : 0,
                OrderDate = DateTime.Now,
                OrderNumber = int.Parse(billPaymentResponse.OrderNumber),
                AccountNumber = request.AccountNumber,
                MerchantName = merchantInfo.MerchantBusinessName,
                MerchantAddress = merchantInfo.MerchantBusinessAddress,
                MerchantPhoneNumber = merchantInfo.MerchantBusinessPhone,
            };

            return receiptResponse;
        }
        #endregion

        #endregion

        #region Product Categories Domain
        private IEnumerable<string> WirelessCategory()
        {
            var wirelessDomain = new[] { "NATIONAL WIRELESS PIN", "NATIONAL TOP UP" };

            return wirelessDomain;
        }

        private IEnumerable<string> LongDistanceCategory()
        {
            var longDsiatanceDomain = new[] { "LONG DISTANCE PIN" };

            return longDsiatanceDomain;
        }

        private IEnumerable<string> PinlessCategory()
        {
            var pinlessDomain = new[] { "PINLESS" };

            return pinlessDomain;
        }

        private IEnumerable<string> InternationalCategory()
        {
            var internationalDomain = new[] { "INTERNATIONAL TOP UP", "INTERNATIONAL WIRELESS PIN" };

            return internationalDomain;
        }

        private IEnumerable<string> SunpassCategory()
        {
            var sunpassDomain = new[] { "SUNPASS TOLL" };

            return sunpassDomain;
        }

        private int GetCategoryFromProductType(ProductItem product)
        {
            if (product.IsTopUp) //Top Up
                return (int)ProductType.TopUp;

            if (product.Type.ToUpper().Contains(DomainCommonValues.BillPaymentKeyword)) //Bill Payment
                return (int) ProductType.BillPayment;

            if (product.Type.ToUpper().Contains(DomainCommonValues.SunpassKeyWord))// Sunpass Replenishment
                return (int) ProductType.SunpassReplenishment;

            if (product.Type.ToUpper().Contains(DomainCommonValues.SunpassDocumentKeyWord))// Sunpass Documents
                return (int)ProductType.SunpassDocument;
            
            return (int) ProductType.SinglePin;// PIN
        }

        #endregion

        #region Pax Terminal

        #region Pax Terminal Members

        public DataResponse AddOrderForPaxTerminal(PaxTerminalTransactionRequest orderRequest)
        {
            try
            {
                var merchantId = int.Parse(orderRequest.CashierId);
                var terminalId = int.Parse(orderRequest.TerminalId);

                //In this case the merchantInfo is located from the global source (because it could be a request from several systems: (TNB, BlackstonePos, etc))
                var merchantInfo = _posMerchantHeader.FindGlobalMerchant(merchantId);

                var product = GetProduct(merchantId, orderRequest.TerminalId,merchantInfo.MerchantPassword, merchantInfo.Name, orderRequest.ProductId);

                if (product != null)
                {
                    var productItem = (product.Data as ProductItem);

                    if (productItem != null)
                    {
                        orderRequest.ProductName = productItem.Name;
                        orderRequest.Country = productItem.DialCountryCode;
                        orderRequest.Type = GetCategoryFromProductType(productItem);   
                    }
                }

                var order = _orderRepository.GetOrderFromPaxTerminalRequest(orderRequest);

                var newOrder = _orderRepository.Add(order);

                orderRequest.OrderId = newOrder.Id;

                _paxTerminalPosRepository.AddPosPaxTerminalOrderRequest(orderRequest);
                _paxTerminalPosRepository.AddPosPaxTerminalPendingOrder(merchantId, terminalId, newOrder.Id);

                return new DataResponse
                {
                    Data = newOrder.Id,
                    Status = (int)RequestStatus.Ok
                };

            }
            catch (Exception exception)
            {
                //Add Error Message if it's not too long
                var errorMessageDetails = exception.Message.Length > 25 ? string.Empty : exception.Message;

                return new DataResponse
                {
                    Status = (int)RequestStatus.KnownErrors,
                    ErrorMessage = "Error trying to Add New Order. " + errorMessageDetails
                };
            }
        }

        public  IEnumerable<PaxTerminalOrder> GetOrders(int merchantId, int terminalId, string serialNumber)
        {
            var orders = _paxTerminalPosRepository.GetOrders(merchantId, terminalId, serialNumber);

            return orders;
        }

        public PaxTerminalResponse ExecuteOrder(int merchantId, int terminalId, int orderNumber, string serialNumber, bool processingMode)
        {
            //Checking credentials and Order Status
            _paxTerminalPosRepository.CheckCredentials(merchantId, terminalId, serialNumber);

            if (processingMode)
                _paxTerminalPosRepository.CheckOrderStatus(orderNumber);

            //Retrieving Category upon OrderId
            var productCategory = _paxTerminalPosRepository.GetProductCategory(orderNumber);

            var executionMethodName = _paxTerminalPosRepository.GetExcutionMethodName(productCategory);

            var function = GetType().GetMethod(executionMethodName);

            //Retrieving parameters to execute the service request
            var transactionRequest = _paxTerminalPosRepository.GetExecutionParameters(orderNumber);

            //If the Serial Number is succesfully checked, then it's passed as part of the request
            transactionRequest.SerialNumber = serialNumber;

            var functParameters = new object[] { transactionRequest };

            var functionResponse = (PaxTerminalResponse)function.Invoke(this, functParameters);

            //Saving the ticket results
            if (functionResponse.Status == (int)RequestStatus.Ok)
                _paxTerminalPosRepository.AddOrderResults(orderNumber, functionResponse.Ticket, processingMode);

            return functionResponse;
        }

        public void CheckCredentials(int merchantId, int terminalId, string serialNumber)
        {
            _paxTerminalPosRepository.CheckCredentials(merchantId, terminalId, serialNumber);
        }

        public BaseResponse RefundOrder(int merchantId, int orderId)
        {
            try
            {
                var merchantInfo = FindMerchant(merchantId);

                var refundResult = _broker.VoidOrder(merchantId.ToString(), merchantInfo.MerchantTerminalID.ToString(),
                    merchantInfo.MerchantPassword, merchantInfo.Name, orderId, TransactionMode.Live);

                var status = int.Parse(refundResult.ErrorCode) + 200; // Success if it's 0
                var errorMessage = refundResult.ErrorMessage;

                if (status == (int) RequestStatus.Ok)
                    MarkOrderAsRefunded(orderId);

                return new BaseResponse
                {
                    ErrorMessage = errorMessage, 
                    Status = status
                };
            }
            catch (Exception exception)
            {
               return new BaseResponse
               {
                   ErrorMessage = exception.Message,
                   Status = 200
               };
            }
        }

        public void MarkOrderAsRefunded(int orderId)
        {
            try
            {
                _orderRepository.MarkOrderAsRefunded(orderId);

            }
            catch (Exception exception)
            {
                return;
            }
        }

        public BaseResponse ResendConfirmationMessage(int orderId)
        {
            try
            {
                var order = _orderRepository.Get(orderId);

                var errorMessage = string.Empty;

                if (order == null)
                    errorMessage += string.Format("Order Number: {0} could not be re-sent!", orderId);
                else if (string.IsNullOrEmpty(order.ConfirmationMessage))
                    errorMessage += "There is no a Phone Number to be re-sent!";
                else if (string.IsNullOrEmpty(order.ConfirmationPhoneNumber))
                    errorMessage += "There is no a valid Phone Number that may be used to re-send the order!";
                else
                {
                    var response = SendSmsConfirmation(order.ConfirmationPhoneNumber, order.ConfirmationMessage);

                    if (response.Status != (int) RequestStatus.Ok)
                        errorMessage += response.ErrorMessage;
                }

                var result = new BaseResponse
                {
                    ErrorMessage = string.IsNullOrEmpty(errorMessage)?"Confirmation Number successfully re-sent": errorMessage,
                    Status = string.IsNullOrEmpty(errorMessage) ? 200 : 201
                };

                return result;

            }
            catch (Exception exception)
            {
                return new BaseResponse
                {
                    Status = 202,
                    ErrorMessage = "Errors trying to re-send confirmation"
                };
            }
        }

        public PaxTerminalResponse RePrintOrder(int merchantId, int terminalId, int orderNumber, string serialNumber)
        {
            _paxTerminalPosRepository.CheckCredentials(merchantId, terminalId, serialNumber);

            var ticketResponse = _paxTerminalPosRepository.GetTicket(orderNumber);

            return ticketResponse;

        }

        public PaxTerminalResponse ConfirmOrder(int merchantId, int terminalId, int orderNumber, string serialNumber)
        {
            try
            {
                _paxTerminalPosRepository.CheckCredentials(merchantId, terminalId, serialNumber);

                _paxTerminalPosRepository.MarkOrderAsProcceed(orderNumber);

                return new PaxTerminalResponse
                {
                    Status = 200,
                    ErrorMessage = "Order Confirmed Successfuly"
                };
            }
            catch (CustomException exception)
            {
                if (exception is OrderAlreadyConfirmedException)
                    return RePrintOrder(merchantId, terminalId, orderNumber, serialNumber);
                throw;
            }
        }

        public bool ValidateCredentialsBySerialNumber(int merchantId, int terminalId, string serialNumber)
        {
                var checkResult = _paxTerminalPosRepository.ValidateMerchantBySerialNumber(merchantId, terminalId, serialNumber);
              
                return checkResult;
        }

        public PaxTerminalResponse GetPaxTerminalSales(int merchantId, string startDate, string endDate, int terminalId, string serialNumber)
        {
            _paxTerminalPosRepository.CheckCredentials(merchantId, terminalId, serialNumber);

            var orders = _orderRepository.GetSalesReport(merchantId,terminalId.ToString(), startDate, endDate);

            return new PaxTerminalResponse
            {
                Ticket = GetSalesTicket(merchantId, orders),

                Status = 200,
            };
        }

        public BaseResponse SendSmsConfirmation(ReceiptResponse receipt, int merchantId, string phoneNumber)
        {
            var ignoreFields = new[] { "ProductInstructions", "ProductCountry", "Tax", 
                                       "Amount", "Fee", "ControlNumber", "TransactionId",
                                       "CarrierName"};

            var merchantInfo = FindMerchant(merchantId);

            var text = merchantInfo.IsFullCarga ? GetFullCargaSmsFormat(receipt, merchantId): receipt.GetBlackstoneSmsFormat(ignoreFields);

            var result =  SendSmsConfirmation(phoneNumber, text);

            if (result.Status == (int) RequestStatus.Ok)
            {
                _orderRepository.UpdateOrderConfirmationData(receipt.OrderNumber, phoneNumber, text);
            }

            return result; 
        }

       
    
        #endregion

        #region Pax Terminal Executions

        public PaxTerminalResponse DoPaxPosSinglePin(PaxTerminalTransactionRequest transactionRequest)
        {
            var transactionResult = LazyGetSinglePin(transactionRequest);

            var receiptResponse = transactionResult.Data as ReceiptResponse;

            var ticket = GetOrderTicket(transactionRequest, receiptResponse, GetPinTicketBody);

            var response = new PaxTerminalResponse
            {
                ErrorMessage = transactionResult.ErrorMessage,
                Status = transactionResult.Status,
                Ticket = ticket
            };

            return response;
        }
     
        public PaxTerminalResponse DoPaxPosTopUp(PaxTerminalTransactionRequest transactionRequest)
        {
            var transactionResult = LazyDoTopUpWithFee(transactionRequest);

            var receiptResponse = transactionResult.Data as ReceiptResponse;

            var ticket = GetOrderTicket(transactionRequest, receiptResponse);

            var response = new PaxTerminalResponse
            {
                ErrorMessage = transactionResult.ErrorMessage,
                Status = transactionResult.Status,
                Ticket = ticket
            };

            return response;
        }
        
        public PaxTerminalResponse DoPaxSunPassReplenishment(PaxTerminalTransactionRequest transactionRequest)
        {
            var lazyExecutionResponse = LazyDoSunPass(transactionRequest);

            var receiptResponse = lazyExecutionResponse.Data as ReceiptResponse;

            var ticket = GetOrderTicket(transactionRequest, receiptResponse);

            var response = new PaxTerminalResponse
            {
                ErrorMessage = lazyExecutionResponse.ErrorMessage,
                Status = lazyExecutionResponse.Status,
                Ticket = ticket
            };

            return response;
        }

        public PaxTerminalResponse DoPaxSunPassDocument(PaxTerminalTransactionRequest transactionRequest)
        {
            var lazyExecutionResponse = LazyDoSunPassDocumentPayment(transactionRequest);

            var receiptResponse = lazyExecutionResponse.Data as ReceiptResponse;

            var ticket = GetOrderTicket(transactionRequest, receiptResponse);

            var response = new PaxTerminalResponse
            {
                ErrorMessage = lazyExecutionResponse.ErrorMessage,
                Status = lazyExecutionResponse.Status,
                Ticket = ticket
            };

            return response;
        }

        public PaxTerminalResponse DoPaxPosBillPayment(PaxTerminalTransactionRequest transactionRequest)
        {
            var cashier = FindMerchant(int.Parse(transactionRequest.CashierId));

            var cashierInfo = cashier.MapTo<Cashier, GiveCashier>();

            var biller = _meteleService.GetMasterBillerOptionsPos(cashierInfo, transactionRequest.VendorId);

            AddBillerExtraInfoFromRequest(transactionRequest, biller);

            var lazyExecutionResponse =  LazyDoBillPayment(biller,transactionRequest);
            
            var receiptResponse = lazyExecutionResponse.Data as ReceiptResponse;

            var ticket = GetOrderTicket(transactionRequest, receiptResponse);

            var response = new PaxTerminalResponse
            {
                ErrorMessage = lazyExecutionResponse.ErrorMessage,
                Status = lazyExecutionResponse.Status,
                Ticket = ticket
            };

            return response;
        }
        #endregion

        #region Orders Lazy Executions
        private DataResponse LazyGetSinglePin(PaxTerminalTransactionRequest transactionRequest)
        {
            var order = _orderRepository.Get(transactionRequest.OrderId);
         
            var merchantInfo =  _posMerchantHeader.FindGlobalMerchant(order.MerchantId);

            var terminalId = !string.IsNullOrEmpty(transactionRequest.TerminalId)
                ? transactionRequest.TerminalId
                : merchantInfo.MerchantTerminalID.ToString();

            try
            {
                var response = !string.IsNullOrEmpty(transactionRequest.SerialNumber) ? _broker.GetSinglePINSerial(merchantInfo.MerchantId.ToString(), terminalId,
                      merchantInfo.MerchantPassword,merchantInfo.Name, order.ProductMainCode, order.Amount.Value,
                      transactionRequest.OrderId, merchantInfo.MerchantProfileID.Value, _transactionMode, transactionRequest.SerialNumber) :
                      _broker.GetSinglePIN(merchantInfo.MerchantId.ToString(), terminalId,
                      merchantInfo.MerchantPassword, merchantInfo.Name, order.ProductMainCode, order.Amount.Value,
                      order.Id,merchantInfo.MerchantProfileID.Value, _transactionMode);

                var pin = response.FirstOrDefault();

                var brokerPinResult = pin.MapTo<PIN, BrokerResponse>();

                brokerPinResult.OrderNumber = order.Id;

                //Successful Order
                if (brokerPinResult.ErrorCode == "0")
                    order.Status = true;
                else
                    RemovePendingOrder(order.Id);

                //To be replaced
                order = MapPinToOrder(order, pin);

                int transactionId;

                if (int.TryParse(pin.TransactionID, out transactionId))
                    order.TransactionID = transactionId;

                Update(_orderRepository, order);

                var receiptResponse = GetReceiptResponse(transactionRequest,brokerPinResult);

                return new DataResponse
                {
                    Data = receiptResponse,
                    Status = brokerPinResult.ErrorCode == "0" ? (int)RequestStatus.Ok : (int)RequestStatus.KnownErrors,
                    ErrorMessage = brokerPinResult.ErrorMessage
                };
            }
            catch (Exception exception)
            {
                order.ErrorMessage = string.Format("Exception: {0}", exception.Message);
              
                Update(_orderRepository, order);

                return new DataResponse(exception);
            }
        }

        private DataResponse LazyDoTopUpWithFee(PaxTerminalTransactionRequest transactionRequest, List<string> additionalPhones = null)
        {
            var order = _orderRepository.Get(transactionRequest.OrderId);
            var merchantInfo = _posMerchantHeader.FindGlobalMerchant(order.MerchantId);
            
            var terminalId = !string.IsNullOrEmpty(transactionRequest.TerminalId)
                ? transactionRequest.TerminalId
                : merchantInfo.MerchantTerminalID.ToString();

            var product = GetProductByMainCode(merchantInfo.MerchantId, transactionRequest.ProductId);

            var fee = product!= null ? product.Fee: 0;


            try
            {
                PIN pin = null;
                if (product.AcceptAdditionalPhones)
                {
                    var additionalPhonesData = this.GetAdditionalPhonesData(additionalPhones);
                    pin = !string.IsNullOrEmpty(transactionRequest.SerialNumber)
                        ? _broker.DoTopUpFeeSerialWithAdditionalPhones(merchantInfo.MerchantId.ToString(), terminalId,
                            merchantInfo.MerchantPassword, merchantInfo.Name, order.ProductMainCode,
                            order.Amount.Value.ToString(), order.PhoneNumber, order.CountryCode, order.Id,
                            merchantInfo.MerchantProfileID.Value, _transactionMode, fee, transactionRequest.SerialNumber,
                            additionalPhonesData)
                        : _broker.DoTopUpFeeWithAdditionalPhones(merchantInfo.MerchantId.ToString(), terminalId,
                            merchantInfo.MerchantPassword, merchantInfo.Name, order.ProductMainCode,
                            order.Amount.Value.ToString(), order.PhoneNumber, order.CountryCode, order.Id,
                            merchantInfo.MerchantProfileID.Value, _transactionMode, fee, additionalPhonesData);
                }
                else
                {
                    pin = !string.IsNullOrEmpty(transactionRequest.SerialNumber)
                        ? _broker.DoTopUpFeeSerial(merchantInfo.MerchantId.ToString(), terminalId,
                            merchantInfo.MerchantPassword, merchantInfo.Name, order.ProductMainCode,
                            order.Amount.Value.ToString(), order.PhoneNumber, order.CountryCode,
                            order.Id, merchantInfo.MerchantProfileID.Value, _transactionMode, fee,
                            transactionRequest.SerialNumber)
                        : _broker.DoTopUpFee(merchantInfo.MerchantId.ToString(), terminalId,
                            merchantInfo.MerchantPassword, merchantInfo.Name, order.ProductMainCode,
                            order.Amount.Value.ToString(), order.PhoneNumber, order.CountryCode,
                            order.Id, merchantInfo.MerchantProfileID.Value, _transactionMode, fee);
                }
                

                var brokerPinResult = pin.MapTo<PIN, BrokerResponse>();

                brokerPinResult.OrderNumber = order.Id;

                //Successful Order
                if (brokerPinResult.ErrorCode == "0")
                    order.Status = true;
                else
                    RemovePendingOrder(order.Id);

                //To be replaced
                order = MapPinToOrder(order, pin);

                //Due to inconsistency in the types in further mapping and joins
                int transactionId;

                if (int.TryParse(pin.TransactionID, out transactionId))
                    order.TransactionID = transactionId;

                Update(_orderRepository, order);

                var receiptResponse = GetReceiptResponse(transactionRequest,brokerPinResult);

                return new DataResponse
                {
                    Data = receiptResponse,
                    Status = brokerPinResult.ErrorCode == "0" ? (int)RequestStatus.Ok : (int)RequestStatus.KnownErrors,
                    ErrorMessage = brokerPinResult.ErrorMessage
                };
            }
            catch (Exception exception)
            {
                order.ErrorMessage = string.Format("Exception: {0}", exception.Message);

                Update(_orderRepository, order);

                return new DataResponse(exception);
            }
        }

        private DataResponse LazyDoSunPass(PaxTerminalTransactionRequest transactionRequest)
        {
            var order = _orderRepository.Get(transactionRequest.OrderId);
            try
            {
                var sunpassProduct = _meteleService.GetSunPassProduct();

                var fee = sunpassProduct.Fee != null ? Convert.ToDouble(sunpassProduct.Fee.Value) : 0;

                var cashier = _posMerchantHeader.FindGlobalMerchant(order.MerchantId);

                var terminalId = !string.IsNullOrEmpty(transactionRequest.TerminalId)
                ? transactionRequest.TerminalId
                : cashier.MerchantTerminalID.ToString();

                var response = _broker.DoSunPassReplenishment(cashier.MerchantId, terminalId,
                                cashier.MerchantPassword, cashier.Name, order.Id, transactionRequest.AccountNumber,
                                Convert.ToDouble(transactionRequest.TotalAmount), fee, transactionRequest.PurchaseId, _transactionMode);

                //Successful Order
                if (response.ResponseCode == 0)
                    order.Status = true;
                else
                {
                    order.ErrorMessage += string.Format("Error Message: {0}", response.ResponseDescription);
                    RemovePendingOrder(order.Id);
                }

                int transactionId;

                //Updating the Transaction ID weather it was or it was not successful
                if (int.TryParse(response.ReferenceNumber.ToString(), out transactionId))
                    order.TransactionID = transactionId;

                Update(_orderRepository, order);

                var receiptResponse = GetSunPassReceiptResponse(transactionRequest, response);

                return new DataResponse
                {
                    Data = receiptResponse,
                    ErrorMessage = response.ResponseDescription,
                    Status = response.ResponseCode == 0 ?(int)RequestStatus.Ok : (int)RequestStatus.KnownErrors,
                };
            }
            catch (Exception exception)
            {
                order.ErrorMessage += string.Format("Error Message: {0}", exception.Message);

                Update(_orderRepository, order);

                return new DataResponse(exception);
            }
        }

        private DataResponse LazyDoSunPassDocumentPayment(PaxTerminalTransactionRequest transactionRequest)
        {
            var broker = new Broker();

            var order = _orderRepository.Get(transactionRequest.OrderId);

            var cashierInfo = _posMerchantHeader.FindGlobalMerchant(order.MerchantId);

            var terminalId = !string.IsNullOrEmpty(transactionRequest.TerminalId)
                ? transactionRequest.TerminalId
                : cashierInfo.MerchantTerminalID.ToString();

            var unpaidDocumentsResponse = broker.DoSunPassDocumentInquiry(cashierInfo.MerchantId, terminalId, cashierInfo.MerchantPassword,
                                                                              cashierInfo.Name, transactionRequest.AccountNumber, transactionRequest.LicensePlate, _transactionMode);

            var documents = transactionRequest.PaymentKeyWord.Equals(DocumentPaymentType.All)
             ? unpaidDocumentsResponse.UnpaidDocumentList
             : (new List<Document> { unpaidDocumentsResponse.UnpaidDocumentList.FirstOrDefault() }).ToArray();

            var product = _meteleService.GetDocumentsProduct();
            var fee = product.Fee.HasValue ? product.Fee.Value : 0;
            var amount = documents.Sum(d => d.DocumentPaymentAmount);

            var response = _broker.DoSunPassDocumentPayment(cashierInfo.MerchantId, terminalId,
                            cashierInfo.MerchantPassword, cashierInfo.Name, order.Id, transactionRequest.AccountNumber,
                            transactionRequest.LicensePlate, amount, Convert.ToDouble(fee),
                            unpaidDocumentsResponse.PurchaseId, documents, _transactionMode);

            //Successful Order
            if (response.ResponseCode == 0)
                order.Status = true;
            else
            {
                order.ErrorMessage += string.Format("Error Message: {0}", response.ResponseDescription);
                RemovePendingOrder(order.Id);
            }
                

            int transactionId;

            //Updating the Transaction ID weather it was or it was not successful
            if (int.TryParse(response.ReferenceNumber.ToString(), out transactionId))
                order.TransactionID = transactionId;

            Update(_orderRepository, order);

            var receiptResponse = GetDocumentsPaymentReceiptResponse(transactionRequest, response);

            return new DataResponse
            {
                Data = receiptResponse,
                ErrorMessage = response.ResponseDescription,
                Status = response.ResponseCode == 0 ? (int)RequestStatus.Ok : (int)RequestStatus.KnownErrors,
            };
        }

        private DataResponse LazyDoBillPayment(MasterBiller biller, PaxTerminalTransactionRequest transactionRequest)
        {
            BillPaymentResponse response;

            var order = _orderRepository.Get(transactionRequest.OrderId);

            var merchantInfo = FindMerchant(int.Parse(transactionRequest.CashierId));

            var cashierInfo = merchantInfo.MapTo<Cashier, GiveCashier>();

            var billPaymentResult = _meteleService.DoBillPaymentPos(cashierInfo, biller, transactionRequest.Fee, order.Id, out response);

            var errorMessage = !string.IsNullOrEmpty(response.ProviderMessage)
                ? response.ProviderMessage
                : !string.IsNullOrEmpty(response.ResultMessage) ? response.ResultMessage : string.Empty;

            order.Status = billPaymentResult;

            if(!order.Status.Value)//If the order failed it's removed from the Queue
                RemovePendingOrder(order.Id);

            order.ErrorMessage = errorMessage;
            Update(_orderRepository, order);

            var receiptResponse = GetBillPaymentReceiptResponse(transactionRequest, response);

            return new DataResponse
            {
                Data = receiptResponse,
                ErrorMessage = errorMessage,
                Status = billPaymentResult ? (int)RequestStatus.Ok : (int)RequestStatus.KnownErrors,
            };
        }
       
        private void RemovePendingOrder(int orderId)
        {
            //Removing Order from the Queue
            _paxTerminalPosRepository.RemovePosPaxTerminalPendingOrder(orderId);
            //_paxTerminalPosRepository.RemovePosPaxTerminalOrderRequest(orderId);
        }
        
        #endregion

        #region Ticket Generator

        private string GetSalesTicket(int merchantId, IEnumerable<Order> sales)
        {
            var separator = string.Empty.PadRight(20, '-');

            var merchantInfo = _posMerchantHeader.FindGlobalMerchant(merchantId);

            var merchantIdText = string.Format("{0}", merchantId);

            if (merchantIdText.Length > 26)
                merchantIdText = merchantIdText.Substring(0, 26);

            var storeNameText = string.Format("{0}^", merchantInfo.MerchantBusinessName);

            if (storeNameText.Length > 26)
                storeNameText = storeNameText.Substring(0, 26);

            var storeAddressText = string.Format("{0}", merchantInfo.MerchantBusinessAddress);

            if (storeAddressText.Length > 26)
                storeAddressText = storeAddressText.Substring(0, 26);

            var dateText = string.Format("Printed:{0}", DateTime.Now);

            if (dateText.Length > 26)
                dateText = dateText.Substring(0, 26);

            var ticketHeader = string.Format("{0}^{1}^{2}^{3}^{4}^", merchantIdText, storeNameText, storeAddressText, dateText, separator);

            var ticketbody = string.Empty;

            foreach (var paxTerminalSale in sales)
            {
                var product = GetProductByMainCode(merchantId, paxTerminalSale.ProductMainCode);

                var dateTime = paxTerminalSale.TimeStamp.HasValue? paxTerminalSale.TimeStamp.Value: default(DateTime);

                var firstLine = dateTime;

                var secondLine = product.Name + " " + paxTerminalSale.Amount.Value.ToString("C");

                ticketbody += string.Format("{0}^{1}^{2}^", firstLine, secondLine, separator);
            }

            var ticketFooter = string.Format("Total:    ${0}", Math.Round(sales.Sum(a => a.Amount.HasValue? a.Amount.Value:0), 2));

            var ticketResult = ticketHeader + ticketbody + ticketFooter + "^^^^^";

            return ticketResult;
        }

        private string GetOrderTicket(PaxTerminalTransactionRequest transactionRequest, ReceiptResponse response, Func<ReceiptResponse, string> coreTicketSectionHandler = null)
        {
            var merchantSection = GetTicketMerchantSection(int.Parse(transactionRequest.CashierId));

            var saleSummarySection = GetTicketSaleSummary(transactionRequest);

            //var coreSection = GetTicketSection(response, "PhoneNumber", "PinNumber", "ControlNumber", "UpdatedBalance","AccountNumber", "LicensePlate");

            var coreSection = coreTicketSectionHandler == null? GetTicketSection(response, "PhoneNumber", "PinNumber", "ControlNumber", "UpdatedBalance","AccountNumber", "LicensePlate"):
                                                                coreTicketSectionHandler(response);

            var instructionsSection = GetInstructionsSection(transactionRequest.CashierId,transactionRequest.ProductId);

            var addInfoSection = coreTicketSectionHandler == null? GetTicketAdditionalInfo(transactionRequest): string.Empty;

            var ticketResult = GetTicketFinalFormat(merchantSection, saleSummarySection, coreSection, instructionsSection, addInfoSection);

            var footerSection = GetTicketFooter();

            ticketResult += footerSection;

            return ticketResult;
        }

        private string GetInstructionsSection(string cashierId, string productMainCode)
        {
            var product = GetProductByMainCode(int.Parse(cashierId), productMainCode);

            return product != null ? product.Instructions : string.Empty;

        }

        private static string GetTicketFinalFormat(params string[] ticketSections)
        {
            var finalTicket = string.Empty;

            var separator = string.Empty.PadLeft(26, '-');

            for (int i = 0; i < ticketSections.Length; i++)
            {
                finalTicket += "^" + ticketSections[i];

                if (!string.IsNullOrEmpty(ticketSections[i]))
                    finalTicket += "^" + separator + "^";
            }

            return finalTicket;
        }

        private static string GetTicketFooter()
        {
            const string footer = "*IMPORTANT: DO NOT GIVE ^ PINs OVER THE PHONE*^^^^^^^^";

            return footer;
        }

        private string GetTicketAdditionalInfo(PaxTerminalTransactionRequest transactionRequest)
        {
            string addInfoResult = string.Empty, addInfoAccessNumbers = string.Empty, addInfoPaidDocuments = string.Empty;

            var merchantId = int.Parse(transactionRequest.CashierId);

            var product = GetProductByMainCode(merchantId, transactionRequest.ProductId);

            //Adding Paid Access Numbers to the Ticket Result
            if (transactionRequest.HasAccessNumbers)
            {
                var accessNumbers = GetProductAccessNumbers(int.Parse(transactionRequest.CashierId), product.Code).ToList();

                var accessNumbersCount = accessNumbers.Count();

                var firstAccessNumbers = accessNumbers.Take(Math.Min(accessNumbersCount, 5));

                addInfoAccessNumbers = firstAccessNumbers.Aggregate(string.Empty, (current, accessNumber) => current + (accessNumber.City + ":" + accessNumber.PhoneNumber.SetAmericanFormat() + "^"));
            }

            //Adding Paid Documents to the Ticket Result
            if (transactionRequest.HasSunPassDocuments)
            {
                addInfoPaidDocuments = GetSunpassDocumentsTicketSection(transactionRequest);
            }

            if (!string.IsNullOrEmpty(addInfoAccessNumbers + addInfoPaidDocuments))
                addInfoResult += addInfoAccessNumbers + "^" + addInfoPaidDocuments;

            return addInfoResult;
        }
        private string GetTicketSection<T>(T type,params string[] properties)
        {
            var typeProperties = typeof (T).GetProperties();

            if (properties.Any())
                typeProperties= typeProperties.Where(prop => properties.Contains(prop.Name)).ToArray();

            var ticket = string.Empty;

            foreach (var propertyInfo in typeProperties)
            {
                var value = propertyInfo.GetValue(type, null);

                if(value == null || string.IsNullOrEmpty(value.ToString().Trim()))
                    continue;
                
                //Change of Line if it doesn't fit
                var saleInfoLine = (propertyInfo.Name.DisplayPropertyName().Length + value.ToString().Length) < 27
                    ? string.Format("{0}:{1}^^", propertyInfo.Name.DisplayPropertyName(), value)
                    : string.Format("{0}:^{1}^^", propertyInfo.Name.DisplayPropertyName(), value);
               
                ticket += saleInfoLine;
            }

            return ticket;
        }

        private string GetTicketMerchantSection(int merchantId)
        {
            var merchantInfo = _posMerchantHeader.FindGlobalMerchant(merchantId);

            var result = string.Format("{0}^{1}^MID:{2}^{3}",merchantInfo.MerchantBusinessName,
                                       merchantInfo.MerchantBusinessAddress,merchantInfo.MerchantId,merchantInfo.MerchantBusinessPhone);

            return result;
        }
        private string GetTicketSaleSummary(PaxTerminalTransactionRequest transactionRequest)
        {
            var amount = decimal.Parse(transactionRequest.TotalAmount);
            var tax = CalculateTaxForMerchant(int.Parse(transactionRequest.CashierId), amount);
            var fee = Convert.ToDecimal(transactionRequest.Fee);
            var total = amount + tax + fee;
            
            var productName = transactionRequest.ProductName;

            var date = DateTime.Now.ToString("M/d/yyyy HH:mm");

            var result = string.Format("Product : {0}^Amount  : {1}^Tax     : {2}^Fee     : {3}^Total   : {4}^Date    : {5}",
                                       productName, amount.ToString("C"), tax.ToString("C"), 
                                       fee.ToString("C"), total.ToString("C"), date);
            return result;
        }

        private decimal CalculateTaxForMerchant(int merchantId, decimal amount)
        {
            var merchantSettings = GetSettings(merchantId);

            var taxCalculated = (amount * merchantSettings.Tax) / 100;

            return taxCalculated;
        }

        private string GetSunpassDocumentsTicketSection(PaxTerminalTransactionRequest transactionRequest)
        {
            try
            {
                var merchantId = int.Parse(transactionRequest.CashierId);

                var documentInquiryResponse = GetSunpassDocumentsInfo(merchantId, transactionRequest.AccountNumber, transactionRequest.LicensePlate);

                var documentsList = transactionRequest.PaymentKeyWord.Equals(DocumentPaymentType.Single.ToString())
                    ? new List<Document> { documentInquiryResponse.RequestedDocument }
                    : documentInquiryResponse.UnpaidDocumentList.ToList();

                var ticketSection = documentsList.Aggregate(string.Empty, (current, document) => current + (document.DocumentId + ":" + document.DocumentPaymentAmount.ToString("C") + "^"));

                return ticketSection;
            }
            catch (Exception exception)
            {
                return string.Empty;
            }

        }

        #region Custom Tickets Templates

        private string GetPinTicketBody(ReceiptResponse response)
        {
            const string firstInstructionLine = "1- Dial / Marque";

            var localNumbersSection = GetLocalAccessNumbersSection(response.LocalPhones.ToList());

            var secondInstructionLine = string.Format("2- Enter PIN:^{0}^", response.PinNumber);

            var controlNumber = string.Format("Control Number: {0}", response.ControlNumber);

            const string productInstructions = "DOMESTIC CALLS DIAL:^   1 + Area Code + Phone #^INTERNATIONAL CALLS DIAL:^   011 + Country Code +^   Area Code + Phone #^"; 

            var customerService = string.Format("Cust. Serv. : {0}", response.CustomerService);

            var expirationDate = string.Format("Expires on: {0}", response.ExpirationDate);

            var result = string.Format("{0}^^{1}^^{2}^^{3}^^{4}^^{5}^^{6}", firstInstructionLine, localNumbersSection,
                secondInstructionLine, productInstructions, controlNumber, customerService, expirationDate);

            return result;
        }

        private string GetLocalAccessNumbersSection(List<AccessNumber> localAccessNumbers)
        {

            var localNumbersResult = localAccessNumbers.Take(Math.Min(localAccessNumbers.Count(), 5));

            var result = localNumbersResult.Aggregate(string.Empty, (current, accessNumber) => current + (accessNumber.City + ":" + 
                                                      accessNumber.AccessNum.SetAmericanFormat() + "^"));
            return result;
        }

        #endregion

        #endregion

        #region Aux Ops

        public string GetFullCargaSmsFormat(ReceiptResponse receipt, int merchantId)
        {
            try
            {
                var order = _orderRepository.Get(receipt.OrderNumber);

                var product = GetProductByMainCode(merchantId, order.ProductMainCode);

                //Completing the access number for the receipt model
                receipt.AccessNumber = GetAccessNumber(merchantId, order.ProductMainCode);

                var productCategory = GetProductCategory(product);

                var smsTemplate = _fullCargaSmsTemplatesRepository.GetSmsTemplateFromCategory(productCategory.ToString()).Trim(' ');

                var text = GetFullCargaSmsTextFromTemplate(receipt, smsTemplate);

                return text;

            }
            catch (Exception exception)
            {
                return string.Empty;
            }
        }

        public string FullcargaAccessNumberTest(int merchantId, string productMainCode)
        {
            var result = GetAccessNumber(merchantId, productMainCode);

            return result;
        }

        public IEnumerable<Order> GetAllValidOrders(int merchantId, DateTime startDate, DateTime endDate)
        {
            endDate = endDate.AddDays(1);

            var allOrders = _orderRepository.Get().ToList();

            var merchant = FindMerchant(merchantId);

            var merchantOrders = allOrders.Where(o => o != null &&
                                                  o.MerchantId == merchantId &&
                                                  merchant.MerchantTerminalID.Value.ToString() == o.TerminalId &&
                                                  o.Status.HasValue && o.Status.Value).ToList();

            //Filtering by Date Range if any
            if (startDate != default(DateTime) && endDate != default(DateTime))
                merchantOrders =
                    merchantOrders.Where(o => o.TimeStamp >= startDate && o.TimeStamp <= endDate).ToList();

            return merchantOrders;
        }

        public void ExportToCsvFile<T>(List<T> data, string fileName)
        {
            try
            {
                data.CreateCsvFile(fileName);
            }
            catch (Exception exception)
            {
                return;
            }
        }

        private string GetFullCargaSmsTextFromTemplate(ReceiptResponse receipt, string smsTemplate)
        {
            try
            {

                var separators = new[] { '{', '}' };
                var tokens = smsTemplate.Split(separators);
                var propertiesToReplace = GetPropertiesToReplace(tokens);

                var oldNewValues = GetOldNewValuesForTemplate(receipt, propertiesToReplace);

                foreach (var oldNewValue in oldNewValues)
                    smsTemplate = smsTemplate.Replace(oldNewValue.Key, oldNewValue.Value);

                var result = smsTemplate.Replace("*~", Environment.NewLine);

                return result.Trim(' ');
            }
            catch (Exception exception)
            {
                return string.Empty;
            }
        }

        private IEnumerable<string> GetPropertiesToReplace(IEnumerable<string> tokens)
        {
            return tokens.Where((t, i) => i % 2 != 0);
        }

        private Dictionary<string, string> GetOldNewValuesForTemplate(ReceiptResponse receipt, IEnumerable<string> propertiesToReplace)
        {
            var result = new Dictionary<string, string>();
            var receiptResponseProperties = receipt.GetType().GetProperties();

            foreach (var replaceProperty in propertiesToReplace)
            {
                var receiptProperty = receiptResponseProperties.FirstOrDefault(p => p.Name.Equals(replaceProperty));

                var value = receiptProperty != null ? receiptProperty.GetValue(receipt) : string.Empty;

                var oldValue = "{" + replaceProperty + "}";
                var newValue = value != null ? value.ToString() : string.Empty;

                result.Add(oldValue, newValue);
            }

            return result;
        }

        private string GetAccessNumber(int merchantId, string productMaincode)
        {
            try
            {
                var accessNumbers = GetProductLocalAccessNumbers(merchantId, productMaincode);

                var firstAccess = accessNumbers.FirstOrDefault();

                return firstAccess.PhoneNumber;
            }
            catch (Exception exception)
            {
                return string.Empty;
            }

        }

        private IEnumerable<ProductAccessPhone> GetProductLocalAccessNumbers(int merchantId, string productMainCode)
        {
            var merchantInfo = FindMerchant(merchantId);

            var accessNumbersResponse = _broker.GetProductLocalPhonesByMerchantId(merchantId.ToString(),
                merchantInfo.MerchantTerminalID.Value.ToString(), merchantInfo.MerchantPassword, productMainCode);

            var result = accessNumbersResponse.AccessPhones;

            return result;
        }

        private BaseResponse SendSmsConfirmation(string phoneNumber, string text)
        {
            var response = _meteleService.SendSms(phoneNumber, text, DateTime.Now.ToString());

            return new BaseResponse
            {
                Status = !string.IsNullOrEmpty(response) ? 200 : 201,
                ErrorMessage = !string.IsNullOrEmpty(response) ? string.Empty : "Message Confirmation could not be sent"
            };
        }

        public  IEnumerable<string> GetRequiredFieldsForRequest(int merchantId, string productMainCode)
        {
            var result = new List<string> {"ProductMainCode", "Amount"};

            try
            {
                // Bill Payment & Sunpass are independently analized 
                var billPaymentProduct = _meteleService.GetBillPaymentProduct();

                if (billPaymentProduct != null && billPaymentProduct.ProductMainCode.Equals(productMainCode))
                {
                    result.Add("VendorId");
                    return result;
                }

                //These products are mutually exclusive
                var sunpassProduct = _meteleService.GetSunPassProduct();

                if (sunpassProduct != null && sunpassProduct.ProductMainCode.Equals(productMainCode))
                {
                    result.Add("AccountNumber");
                    return result;
                }

                var product = GetProductByMainCode(merchantId, productMainCode);

                if(product.IsTopUp)
                    result.Add("PhoneNumber");

                return result;
            }
            catch (Exception exception)
            {
                return result;
            }

        }

        public string ValidatePosAddOrderRequest(OrderRequest orderRequest)
        {
            try
            {
                var result = string.Empty;

                var requiredFields = GetRequiredFieldsForRequest(orderRequest.MerchantId, orderRequest.ProductMainCode);

                var requestPropertiesToCheck = orderRequest.GetType().GetProperties().Where(a => requiredFields.Contains(a.Name));

                foreach (var requestProperty in requestPropertiesToCheck)
                {
                    var requestFieldValue = requestProperty.GetValue(orderRequest);

                    if (requestFieldValue == null || string.IsNullOrEmpty(requestFieldValue.ToString()))
                        result += string.Format("{0} is Required. ", requestProperty.Name);
                }

                return result;
            }
            catch (Exception exception)
            {
                return string.Empty;
            }
        }

        #endregion

        #endregion

        //#region Monetra

        //private PaymentOperationResult AddFoundsUsingNonCreditPaymentBsPos(NonCreditPayment aNonCreditPayment)
        //{
        //    var result = PaymentOperationResult.Instance(false, string.Empty);

        //    try
        //    {
        //        var checkRequest = CreateCheckRequest(aNonCreditPayment.RoutingNumber, aNonCreditPayment.AccountNumber, aNonCreditPayment.Amount.ToString());

        //        var checkResponse = ProcessCheck(checkRequest);

        //        if (checkResponse != null)
        //        {
        //            result.WasSuccess = checkResponse.ResponseCode == MonetraApiConnector.Models.ResponseCodes.OPERATION_OK;
        //            result.Message = checkResponse.Message;
        //        }

        //        return result;
        //    }
        //    catch (Exception exception)
        //    {
        //        return result;
        //    }
        //}

        //private CheckRequest CreateCheckRequest(string aRoutingNumber, string aAccountNumber, string aAmount)
        //{
        //    try
        //    {
        //        var checkUserName = GetCheckMonetraUserName();
        //        var checkPassword = GetCheckMonetraPass();
        //        var checkAppKey = GetCheckMonetraAppKey();
        //        var checkAppType = GetAppSettingByKey(CommonValues.CheckAppType);
        //        var checkMid = GetMonetraMid();
        //        var checkCid = GetMonetraCid();
        //        var checkTid = GetAppSettingByKey(CommonValues.CheckTid);
        //        var checkNumber = ServiceImplementationUtils.GetRandomNumber();

        //        var checkRequest = new CheckRequest
        //        {
        //            UserName = checkUserName,
        //            Password = checkPassword,
        //            AppKey = checkAppKey,
        //            AppType = Int32.Parse(checkAppType),
        //            mid = Int32.Parse(checkMid),
        //            cid = Int32.Parse(checkCid),
        //            TerminalID = checkTid,
        //            PacketIdentifier = PacketIndetifier.A,
        //            ROUTING_NUMBER = aRoutingNumber,
        //            ACCOUNT_NUMBER = aAccountNumber,
        //            CHECK_NUMBER = checkNumber,
        //            ACCOUNT_TYPE = AccountType.CHECKING,
        //            FIRST_NAME = CommonValues.CompanyName,
        //            LAST_NAME = CommonValues.CompanyName,
        //            ADDRESS1 = String.Empty,
        //            CITY = String.Empty,
        //            STATE = StatesAndProvinces.FL,
        //            ZIP = String.Empty,
        //            DL_NUMBER = String.Empty,
        //            PHONE_NUMBER = String.Empty,
        //            SSN4 = String.Empty,
        //            CHECK_AMOUNT = aAmount,
        //            Method = MethodType.CheckNoVerificationDLOptional
        //        };

        //        return checkRequest;
        //    }
        //    catch (Exception exception)
        //    {

        //        return null;
        //    }
        //}

        //private CheckResponse ProcessCheck(CheckRequest checkRequest)
        //{
        //    try
        //    {
        //        var monetraUrl = GetMonetraApiUrl();

        //        var processCheckResponse = CheckWebConnector.ProcessCheck(checkRequest, monetraUrl);

        //        return processCheckResponse;
        //    }
        //    catch (Exception exception)
        //    {
        //        return null;
        //    }
        //}

        //private string GetMonetraApiUrl()
        //{
        //    try
        //    {
        //        var devEnvairoment = Boolean.Parse(ConfigurationManager.AppSettings[CommonValues.DevEnvairoment]);

        //        var monetraApiUrl = GetAppSettingByKey(devEnvairoment ? CommonValues.MonetraTestingUrl : CommonValues.MonetraUrl);

        //        return monetraApiUrl;
        //    }
        //    catch (Exception exception)
        //    {
        //        return string.Empty;
        //    }
        //}

        //private string GetAppSettingByKey(string aAppKey)
        //{
        //    try
        //    {
        //        var settings = ConfigurationManager.AppSettings;

        //        var appSetting = ConfigurationManager.AppSettings[aAppKey];

        //        return appSetting;
        //    }
        //    catch (Exception exception)
        //    {
        //        return string.Empty;
        //    }
        //}

        //private string GetCheckMonetraUserName()
        //{
        //    try
        //    {
        //        var monetraCheckUserName = GetAppSettingByKey(CommonValues.CheckUserName);

        //        return monetraCheckUserName;
        //    }
        //    catch (Exception exception)
        //    {
        //        return string.Empty;
        //    }
        //}

        //private string GetCheckMonetraPass()
        //{
        //    try
        //    {
        //        var monetraCheckPass = GetAppSettingByKey(CommonValues.CheckPassword);

        //        return monetraCheckPass;
        //    }
        //    catch (Exception exception)
        //    {
        //        return string.Empty;
        //    }
        //}

        //private string GetCheckMonetraAppKey()
        //{
        //    try
        //    {
        //        var checkAppKey = GetAppSettingByKey(CommonValues.CheckAppKey);

        //        return checkAppKey;
        //    }
        //    catch (Exception exception)
        //    {
        //        return string.Empty;
        //    }
        //}

        //private string GetMonetraMid()
        //{
        //    try
        //    {
        //        var devEnvairoment = Boolean.Parse(ConfigurationManager.AppSettings[CommonValues.DevEnvairoment]);

        //        var monetraMid = GetAppSettingByKey(devEnvairoment ? CommonValues.MonetraTestingMid : CommonValues.MonetraMid);

        //        return monetraMid;
        //    }
        //    catch (Exception exception)
        //    {
        //        return string.Empty;
        //    }
        //}

        //private string GetMonetraCid()
        //{
        //    try
        //    {
        //        var devEnvairoment = Boolean.Parse(ConfigurationManager.AppSettings[CommonValues.DevEnvairoment]);

        //        var monetraCid = GetAppSettingByKey(devEnvairoment ? CommonValues.MonetraTestingCid : CommonValues.MonetraCid);

        //        return monetraCid;
        //    }
        //    catch (Exception exception)
        //    {
        //        return string.Empty;
        //    }
        //}

        //#endregion

        private AdditionalPhonesData GetAdditionalPhonesData(IEnumerable<string> phonesList)
        {
            if (phonesList == null)
                return null;
            var additionalPhones = phonesList.Select(p => new AdditionalPhone() {PhoneNumber = p});
            return new AdditionalPhonesData(){AdditionalPhones = additionalPhones.ToArray()};
        }
    }
   
    //static class MonetraHeleper
    //{
    //    /// Created by: yandi quesada (03042014) 
    //    /// Modified by: 
    //    /// <summary>
    //    /// Get log data for object type CheckRequest
    //    /// </summary>
    //    /// <param name="aCheckRequest"></param>
    //    /// <returns></returns>
    //    public static string GetDataForLog(this CheckRequest aCheckRequest)
    //    {
    //        var stringBuilder = new StringBuilder();

    //        stringBuilder.AppendFormat("{0}", "Monetra check Request attributes:");
    //        stringBuilder.AppendLine();
    //        stringBuilder.AppendFormat(" {0} : {1}", "UserName", aCheckRequest.UserName);
    //        stringBuilder.AppendLine();
    //        stringBuilder.AppendFormat(" {0} : {1}", "Password", aCheckRequest.Password);
    //        stringBuilder.AppendLine();
    //        stringBuilder.AppendFormat(" {0} : {1}", "AppKey", aCheckRequest.AppKey);
    //        stringBuilder.AppendLine();
    //        stringBuilder.AppendFormat(" {0} : {1}", "AppType", aCheckRequest.AppType);
    //        stringBuilder.AppendLine();
    //        stringBuilder.AppendFormat(" {0} : {1}", "mid", aCheckRequest.mid);
    //        stringBuilder.AppendLine();
    //        stringBuilder.AppendFormat(" {0} : {1}", "cid", aCheckRequest.cid);
    //        stringBuilder.AppendLine();
    //        stringBuilder.AppendFormat(" {0} : {1}", "TerminalID", aCheckRequest.TerminalID);
    //        stringBuilder.AppendLine();
    //        stringBuilder.AppendFormat(" {0} : {1}", "PacketIdentifier", aCheckRequest.PacketIdentifier);
    //        stringBuilder.AppendLine();
    //        stringBuilder.AppendFormat(" {0} : {1}", "ROUTING_NUMBER", aCheckRequest.ROUTING_NUMBER);
    //        stringBuilder.AppendLine();
    //        stringBuilder.AppendFormat(" {0} : {1}", "ACCOUNT_NUMBER", aCheckRequest.ACCOUNT_NUMBER);
    //        stringBuilder.AppendLine();
    //        stringBuilder.AppendFormat(" {0} : {1}", "CHECK_NUMBER", aCheckRequest.CHECK_NUMBER);
    //        stringBuilder.AppendLine();
    //        stringBuilder.AppendFormat(" {0} : {1}", "ACCOUNT_TYPE", aCheckRequest.ACCOUNT_TYPE);
    //        stringBuilder.AppendLine();
    //        stringBuilder.AppendFormat(" {0} : {1}", "FIRST_NAME", aCheckRequest.FIRST_NAME);
    //        stringBuilder.AppendLine();
    //        stringBuilder.AppendFormat(" {0} : {1}", "LAST_NAME", aCheckRequest.LAST_NAME);
    //        stringBuilder.AppendLine();
    //        stringBuilder.AppendFormat(" {0} : {1}", "ADDRESS1", aCheckRequest.ADDRESS1);
    //        stringBuilder.AppendLine();
    //        stringBuilder.AppendFormat(" {0} : {1}", "CITY", aCheckRequest.CITY);
    //        stringBuilder.AppendLine();
    //        stringBuilder.AppendFormat(" {0} : {1}", "STATE", aCheckRequest.STATE);
    //        stringBuilder.AppendLine();
    //        stringBuilder.AppendFormat(" {0} : {1}", "ZIP", aCheckRequest.ZIP);
    //        stringBuilder.AppendLine();
    //        stringBuilder.AppendFormat(" {0} : {1}", "DL_NUMBER", aCheckRequest.DL_NUMBER);
    //        stringBuilder.AppendLine();
    //        stringBuilder.AppendFormat(" {0} : {1}", "PHONE_NUMBER", aCheckRequest.PHONE_NUMBER);
    //        stringBuilder.AppendLine();
    //        stringBuilder.AppendFormat(" {0} : {1}", "SSN4", aCheckRequest.SSN4);
    //        stringBuilder.AppendLine();
    //        stringBuilder.AppendFormat(" {0} : {1}", "CHECK_AMOUNT", aCheckRequest.CHECK_AMOUNT);
    //        stringBuilder.AppendLine();
    //        stringBuilder.AppendFormat(" {0} : {1}", "Method", aCheckRequest.Method);

    //        var data = stringBuilder.ToString();
    //        return data;
    //    }

    //    /// Created by: yandi quesada (03142014)
    //    /// Modified by: 
    //    /// <summary>
    //    /// Get Sale Debit Request Data For Log
    //    /// </summary>
    //    /// <param name="aSaleDebitRequest"></param>
    //    /// <returns></returns>
    //    public static string GetSaleDebitRequestDataForLog(this SaleDebitRequest aSaleDebitRequest)
    //    {
    //        var saleDebitRequestDataForLog = new StringBuilder();

    //        saleDebitRequestDataForLog.AppendFormat("{0}", "Monetra sale Debit Request attributes:");
    //        saleDebitRequestDataForLog.AppendLine();

    //        saleDebitRequestDataForLog.AppendFormat(" {0} : {1}", "CardNumber", aSaleDebitRequest.CardNumber);
    //        saleDebitRequestDataForLog.AppendLine();

    //        saleDebitRequestDataForLog.AppendFormat(" {0} : {1}", "NameOnCard", aSaleDebitRequest.NameOnCard);
    //        saleDebitRequestDataForLog.AppendLine();

    //        saleDebitRequestDataForLog.AppendFormat(" {0} : {1}", "CVN", aSaleDebitRequest.CVN);
    //        saleDebitRequestDataForLog.AppendLine();

    //        saleDebitRequestDataForLog.AppendFormat(" {0} : {1}", "ExpDate", aSaleDebitRequest.ExpDate);
    //        saleDebitRequestDataForLog.AppendLine();

    //        saleDebitRequestDataForLog.AppendFormat(" {0} : {1}", "ZipCode", aSaleDebitRequest.ZipCode);
    //        saleDebitRequestDataForLog.AppendLine();

    //        saleDebitRequestDataForLog.AppendFormat(" {0} : {1}", "Amount", aSaleDebitRequest.Amount);
    //        saleDebitRequestDataForLog.AppendLine();

    //        saleDebitRequestDataForLog.AppendFormat(" {0} : {1}", "AppKey", aSaleDebitRequest.AppKey);
    //        saleDebitRequestDataForLog.AppendLine();

    //        saleDebitRequestDataForLog.AppendFormat(" {0} : {1}", "AppType", aSaleDebitRequest.AppType);
    //        saleDebitRequestDataForLog.AppendLine();

    //        saleDebitRequestDataForLog.AppendFormat(" {0} : {1}", "UserName", aSaleDebitRequest.UserName);
    //        saleDebitRequestDataForLog.AppendLine();

    //        saleDebitRequestDataForLog.AppendFormat(" {0} : {1}", "Password", aSaleDebitRequest.Password);
    //        saleDebitRequestDataForLog.AppendLine();

    //        saleDebitRequestDataForLog.AppendFormat(" {0} : {1}", "mid", aSaleDebitRequest.mid);
    //        saleDebitRequestDataForLog.AppendLine();

    //        saleDebitRequestDataForLog.AppendFormat(" {0} : {1}", "cid", aSaleDebitRequest.cid);
    //        saleDebitRequestDataForLog.AppendLine();

    //        saleDebitRequestDataForLog.AppendFormat(" {0} : {1}", "TransactionType", aSaleDebitRequest.TransactionType);
    //        saleDebitRequestDataForLog.AppendLine();

    //        saleDebitRequestDataForLog.AppendFormat(" {0} : {1}", "UserTransactionNumber", aSaleDebitRequest.UserTransactionNumber);
    //        saleDebitRequestDataForLog.AppendLine();

    //        return saleDebitRequestDataForLog.ToString();
    //    }

    //    /// Created by: yandi quesada (03142014)
    //    /// Modified by: 
    //    /// <summary>
    //    /// Get Sale Debit Response Data For Log
    //    /// </summary>
    //    /// <param name="aSaleResponse"></param>
    //    /// <returns></returns>
    //    public static string GetSaleResponseDataForLog(this SaleResponse aSaleResponse)
    //    {
    //        var saleResponseDataForLog = new StringBuilder();

    //        saleResponseDataForLog.AppendFormat("{0}", "Monetra Sale Response attributes:");
    //        saleResponseDataForLog.AppendLine();

    //        saleResponseDataForLog.AppendFormat(" {0} : {1}", "LastFour", aSaleResponse.LastFour);
    //        saleResponseDataForLog.AppendLine();

    //        saleResponseDataForLog.AppendFormat(" {0} : {1}", "msoft_code", aSaleResponse.msoft_code);
    //        saleResponseDataForLog.AppendLine();

    //        saleResponseDataForLog.AppendFormat(" {0} : {1}", "phard_code", aSaleResponse.phard_code);
    //        saleResponseDataForLog.AppendLine();

    //        saleResponseDataForLog.AppendFormat(" {0} : {1}", "ResponseCode", aSaleResponse.ResponseCode);
    //        saleResponseDataForLog.AppendLine();

    //        saleResponseDataForLog.AppendFormat(" {0} : {1}", "ServiceReferenceNumber", aSaleResponse.ServiceReferenceNumber);
    //        saleResponseDataForLog.AppendLine();

    //        saleResponseDataForLog.AppendFormat(" {0} : {1}", "verbiage", aSaleResponse.verbiage);
    //        saleResponseDataForLog.AppendLine();

    //        saleResponseDataForLog.AppendFormat(" {0} : {1}", "ErrorMessage", aSaleResponse.ErrorMessage());
    //        saleResponseDataForLog.AppendLine();

    //        saleResponseDataForLog.AppendFormat(" {0} :", "Message list");
    //        saleResponseDataForLog.AppendLine();

    //        var messages = aSaleResponse.Msg;

    //        foreach (var message in messages)
    //        {
    //            saleResponseDataForLog.AppendFormat(" {0}", message);
    //            saleResponseDataForLog.AppendLine();
    //        }

    //        var dataLog = saleResponseDataForLog.ToString();

    //        return dataLog;
    //    }

    //    /// Created by: yandi quesada (03152014)
    //    /// Modified by: 
    //    /// <summary>
    //    /// Get Refund Request Data For Log
    //    /// </summary>
    //    /// <param name="aRefundRequest"></param>
    //    /// <returns></returns>
    //    public static string GetRefundRequestDataForLog(this RefundRequest aRefundRequest)
    //    {
    //        var refundResponseDataForLog = new StringBuilder();

    //        refundResponseDataForLog.AppendFormat("{0}", "Monetra Refund Request attributes:");
    //        refundResponseDataForLog.AppendLine();
    //        refundResponseDataForLog.AppendFormat("{0} : {1}", "Account", aRefundRequest.Account);
    //        refundResponseDataForLog.AppendLine();
    //        refundResponseDataForLog.AppendFormat("{0} : {1}", "AppKey", aRefundRequest.AppKey);
    //        refundResponseDataForLog.AppendLine();
    //        refundResponseDataForLog.AppendFormat("{0} : {1}", "AppType", aRefundRequest.AppType);
    //        refundResponseDataForLog.AppendLine();
    //        refundResponseDataForLog.AppendFormat("{0} : {1}", "UserName", aRefundRequest.UserName);
    //        refundResponseDataForLog.AppendLine();
    //        refundResponseDataForLog.AppendFormat("{0} : {1}", "Password", aRefundRequest.Password);
    //        refundResponseDataForLog.AppendLine();
    //        refundResponseDataForLog.AppendFormat("{0} : {1}", "mid", aRefundRequest.mid);
    //        refundResponseDataForLog.AppendLine();
    //        refundResponseDataForLog.AppendFormat("{0} : {1}", "cid", aRefundRequest.cid);
    //        refundResponseDataForLog.AppendLine();
    //        refundResponseDataForLog.AppendFormat("{0} : {1}", "Amount", aRefundRequest.Amount);
    //        refundResponseDataForLog.AppendLine();
    //        refundResponseDataForLog.AppendFormat("{0} : {1}", "ExpDate", aRefundRequest.ExpDate);
    //        refundResponseDataForLog.AppendLine();
    //        refundResponseDataForLog.AppendFormat("{0} : {1}", "UserTransactionNumber", aRefundRequest.UserTransactionNumber);
    //        refundResponseDataForLog.AppendLine();
    //        refundResponseDataForLog.AppendFormat("{0} : {1}", "ServiceTransactionNumber", aRefundRequest.ServiceTransactionNumber);
    //        refundResponseDataForLog.AppendLine();

    //        var dataLog = refundResponseDataForLog.ToString();
    //        return dataLog;
    //    }

    //    /// Created by: yandi quesada (03152014)
    //    /// Modified by:
    //    /// <summary>
    //    /// Get Fraud Auto Deny Options Request Data For Log
    //    /// </summary>
    //    /// <param name="aFraudAutoDenyOptionsRequest"></param>
    //    /// <returns></returns>
    //    public static string GetFraudAutoDenyOptionsRequestDataForLog(this FraudAutoDenyOptionsRequest aFraudAutoDenyOptionsRequest)
    //    {
    //        var fraudAutoDenyOptionsRequest = new StringBuilder();

    //        fraudAutoDenyOptionsRequest.AppendFormat("{0}", "Monetra Fraud Auto Deny Options Request attributes:");
    //        fraudAutoDenyOptionsRequest.AppendLine();
    //        fraudAutoDenyOptionsRequest.AppendFormat("{0} : {1}", "AppKey", aFraudAutoDenyOptionsRequest.AppKey);
    //        fraudAutoDenyOptionsRequest.AppendLine();
    //        fraudAutoDenyOptionsRequest.AppendFormat("{0} : {1}", "AppType", aFraudAutoDenyOptionsRequest.AppType);
    //        fraudAutoDenyOptionsRequest.AppendLine();
    //        fraudAutoDenyOptionsRequest.AppendFormat("{0} : {1}", "UserName", aFraudAutoDenyOptionsRequest.UserName);
    //        fraudAutoDenyOptionsRequest.AppendLine();
    //        fraudAutoDenyOptionsRequest.AppendFormat("{0} : {1}", "Password", aFraudAutoDenyOptionsRequest.Password);
    //        fraudAutoDenyOptionsRequest.AppendLine();
    //        fraudAutoDenyOptionsRequest.AppendFormat("{0} : {1}", "mid", aFraudAutoDenyOptionsRequest.mid);
    //        fraudAutoDenyOptionsRequest.AppendLine();
    //        fraudAutoDenyOptionsRequest.AppendFormat("{0} : {1}", "cid", aFraudAutoDenyOptionsRequest.cid);
    //        fraudAutoDenyOptionsRequest.AppendLine();
    //        fraudAutoDenyOptionsRequest.AppendFormat("{0} :", "Options");
    //        fraudAutoDenyOptionsRequest.AppendLine();

    //        var options = aFraudAutoDenyOptionsRequest.Options;
    //        if (options != null)
    //        {
    //            foreach (var option in options)
    //            {
    //                fraudAutoDenyOptionsRequest.AppendFormat("{0} :", option);
    //                fraudAutoDenyOptionsRequest.AppendLine();
    //            }
    //        }

    //        var dataLog = fraudAutoDenyOptionsRequest.ToString();
    //        return dataLog;
    //    }

    //    /// Created by: yandi quesada (03152014)
    //    /// Modified by:
    //    /// <summary>
    //    /// Get User Autodeny Options Response Data For Log
    //    /// </summary>
    //    /// <param name="aAutodenyOptionsResponse"></param>
    //    /// <returns></returns>
    //    public static string GetUserAutodenyOptionsResponseDataForLog(this GetUserAutodenyOptionsResponse aAutodenyOptionsResponse)
    //    {
    //        var autodenyOptionsResponseLog = new StringBuilder();

    //        autodenyOptionsResponseLog.AppendFormat("{0}", "Monetra Fraud Auto Deny Options Response attributes:");
    //        autodenyOptionsResponseLog.AppendLine();
    //        autodenyOptionsResponseLog.AppendFormat("{0} : {1}", "ResponseCode", aAutodenyOptionsResponse.ResponseCode);
    //        autodenyOptionsResponseLog.AppendLine();

    //        autodenyOptionsResponseLog.AppendFormat(" {0} :", "Message list");
    //        autodenyOptionsResponseLog.AppendLine();

    //        var messages = aAutodenyOptionsResponse.Msg;
    //        if (messages != null)
    //        {
    //            foreach (var message in messages)
    //            {
    //                autodenyOptionsResponseLog.AppendFormat(" {0}", message);
    //                autodenyOptionsResponseLog.AppendLine();
    //            }
    //        }

    //        autodenyOptionsResponseLog.AppendFormat("{0} :", "Options");
    //        autodenyOptionsResponseLog.AppendLine();

    //        var options = aAutodenyOptionsResponse.Options;
    //        if (options != null)
    //        {
    //            foreach (var option in options)
    //            {
    //                autodenyOptionsResponseLog.AppendFormat("{0} :", option);
    //                autodenyOptionsResponseLog.AppendLine();
    //            }
    //        }

    //        var dataLog = autodenyOptionsResponseLog.ToString();
    //        return dataLog;
    //    }

    //    ///// Created by: yandi quesada (03152014)
    //    ///// Modified by: 
    //    ///// <summary>
    //    ///// Get Response Data For Log
    //    ///// </summary>
    //    ///// <param name="response"></param>
    //    ///// <returns></returns>
    //    //public static string GetResponseDataForLog(this Response response)
    //    //{
    //    //    var responseLog = new StringBuilder();

    //    //    responseLog.AppendFormat("{0}", "Monetra Response attributes:");
    //    //    responseLog.AppendLine();
    //    //    responseLog.AppendFormat("{0} : {1}", "ResponseCode", response.ResponseCode);
    //    //    responseLog.AppendLine();

    //    //    responseLog.AppendFormat(" {0} :", "Message list");
    //    //    responseLog.AppendLine();

    //    //    var messages = response.Msg;
    //    //    if (messages != null)
    //    //    {
    //    //        foreach (var message in messages)
    //    //        {
    //    //            responseLog.AppendFormat(" {0}", message);
    //    //            responseLog.AppendLine();
    //    //        }
    //    //    }

    //    //    var dataLog = responseLog.ToString();
    //    //    return dataLog;
    //    //}

    //    /// Created by: yandi quesada (03152014)
    //    /// Modified by: 
    //    /// <summary>
    //    /// Get Sale With Token Request Data For Log
    //    /// </summary>
    //    /// <param name="aSaleWithTokenRequest"></param>
    //    /// <returns></returns>
    //    public static string GetSaleWithTokenRequestDataForLog(this SaleWithTokenRequest aSaleWithTokenRequest)
    //    {
    //        var saleWithTokenRequestLog = new StringBuilder();

    //        saleWithTokenRequestLog.AppendFormat("{0}", "Monetra Sale With Token Request attributes:");
    //        saleWithTokenRequestLog.AppendLine();
    //        saleWithTokenRequestLog.AppendFormat("{0} : {1}", "Token", aSaleWithTokenRequest.Token);
    //        saleWithTokenRequestLog.AppendLine();
    //        saleWithTokenRequestLog.AppendFormat("{0} : {1}", "AppKey", aSaleWithTokenRequest.AppKey);
    //        saleWithTokenRequestLog.AppendLine();
    //        saleWithTokenRequestLog.AppendFormat("{0} : {1}", "AppType", aSaleWithTokenRequest.AppType);
    //        saleWithTokenRequestLog.AppendLine();
    //        saleWithTokenRequestLog.AppendFormat("{0} : {1}", "UserName", aSaleWithTokenRequest.UserName);
    //        saleWithTokenRequestLog.AppendLine();
    //        saleWithTokenRequestLog.AppendFormat("{0} : {1}", "Password", aSaleWithTokenRequest.Password);
    //        saleWithTokenRequestLog.AppendLine();
    //        saleWithTokenRequestLog.AppendFormat("{0} : {1}", "mid", aSaleWithTokenRequest.mid);
    //        saleWithTokenRequestLog.AppendLine();
    //        saleWithTokenRequestLog.AppendFormat("{0} : {1}", "cid", aSaleWithTokenRequest.cid);
    //        saleWithTokenRequestLog.AppendLine();
    //        saleWithTokenRequestLog.AppendFormat("{0} : {1}", "Amount", aSaleWithTokenRequest.Amount);
    //        saleWithTokenRequestLog.AppendLine();
    //        saleWithTokenRequestLog.AppendFormat("{0} : {1}", "TransactionType", aSaleWithTokenRequest.TransactionType);
    //        saleWithTokenRequestLog.AppendLine();
    //        saleWithTokenRequestLog.AppendFormat("{0} : {1}", "UserTransactionNumber", aSaleWithTokenRequest.UserTransactionNumber);
    //        saleWithTokenRequestLog.AppendLine();

    //        var dataLog = saleWithTokenRequestLog.ToString();
    //        return dataLog;
    //    }

    //    /// Created by: yandi quesada (03152014)
    //    /// Modified by:
    //    /// <summary>
    //    /// Get Token  For Card Request Data For Log
    //    /// </summary>
    //    /// <param name="aGetTokenForCardRequest"></param>
    //    /// <returns></returns>
    //    public static string GetTokenForCardRequestDataForLog(this GetTokenForCardRequest aGetTokenForCardRequest)
    //    {
    //        var tokenRequestLog = new StringBuilder();

    //        tokenRequestLog.AppendFormat("{0}", "Monetra Get Token For Card Request attributes:");
    //        tokenRequestLog.AppendLine();
    //        tokenRequestLog.AppendFormat("{0} : {1}", "AppKey", aGetTokenForCardRequest.AppKey);
    //        tokenRequestLog.AppendLine();
    //        tokenRequestLog.AppendFormat("{0} : {1}", "AppType", aGetTokenForCardRequest.AppType);
    //        tokenRequestLog.AppendLine();
    //        tokenRequestLog.AppendFormat("{0} : {1}", "UserName", aGetTokenForCardRequest.UserName);
    //        tokenRequestLog.AppendLine();
    //        tokenRequestLog.AppendFormat("{0} : {1}", "Password", aGetTokenForCardRequest.Password);
    //        tokenRequestLog.AppendLine();
    //        tokenRequestLog.AppendFormat("{0} : {1}", "mid", aGetTokenForCardRequest.mid);
    //        tokenRequestLog.AppendLine();
    //        tokenRequestLog.AppendFormat("{0} : {1}", "cid", aGetTokenForCardRequest.cid);
    //        tokenRequestLog.AppendLine();
    //        tokenRequestLog.AppendFormat("{0} : {1}", "Account", aGetTokenForCardRequest.Account);
    //        tokenRequestLog.AppendLine();
    //        tokenRequestLog.AppendFormat("{0} : {1}", "NameOnCard", aGetTokenForCardRequest.NameOnCard);
    //        tokenRequestLog.AppendLine();
    //        tokenRequestLog.AppendFormat("{0} : {1}", "cv", aGetTokenForCardRequest.cv);
    //        tokenRequestLog.AppendLine();
    //        tokenRequestLog.AppendFormat("{0} : {1}", "expDate", aGetTokenForCardRequest.expDate);
    //        tokenRequestLog.AppendLine();
    //        tokenRequestLog.AppendFormat("{0} : {1}", "zipCode", aGetTokenForCardRequest.zipCode);
    //        tokenRequestLog.AppendLine();

    //        var dataLog = tokenRequestLog.ToString();
    //        return dataLog;
    //    }

    //    /// Created by: yandi quesada (03152014)
    //    /// Modified by:
    //    /// <summary>
    //    /// Get TokenForCardResponseDataForLog
    //    /// </summary>
    //    /// <param name="aGetTokenForCardResponse"></param>
    //    /// <returns></returns>
    //    public static string GetTokenForCardResponseDataForLog(this GetTokenForCardResponse aGetTokenForCardResponse)
    //    {
    //        var tokenResponseLog = new StringBuilder();

    //        tokenResponseLog.AppendFormat("{0}", "Monetra Get Token For Card Response attributes:");
    //        tokenResponseLog.AppendLine();
    //        tokenResponseLog.AppendFormat("{0} : {1}", "ResponseCode", aGetTokenForCardResponse.ResponseCode);
    //        tokenResponseLog.AppendLine();

    //        tokenResponseLog.AppendFormat("{0} : {1}", "PhardCode", aGetTokenForCardResponse.PhardCode);
    //        tokenResponseLog.AppendLine();
    //        tokenResponseLog.AppendFormat("{0} : {1}", "Token", aGetTokenForCardResponse.Token);
    //        tokenResponseLog.AppendLine();
    //        tokenResponseLog.AppendFormat("{0} : {1}", "Verbiage", aGetTokenForCardResponse.Verbiage);
    //        tokenResponseLog.AppendLine();
    //        tokenResponseLog.AppendFormat("{0} : {1}", "msoft_code", aGetTokenForCardResponse.msoft_code);
    //        tokenResponseLog.AppendLine();

    //        tokenResponseLog.AppendFormat(" {0} :", "Message list");
    //        tokenResponseLog.AppendLine();

    //        var messages = aGetTokenForCardResponse.Msg;
    //        if (messages != null)
    //        {
    //            foreach (var message in messages)
    //            {
    //                tokenResponseLog.AppendFormat(" {0}", message);
    //                tokenResponseLog.AppendLine();
    //            }
    //        }

    //        var dataLog = tokenResponseLog.ToString();
    //        return dataLog;
    //    }

    //}
}
