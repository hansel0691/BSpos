using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Description;
using BlackstonePos.Data.Infrastructure;
using BlackstonePos.Domain.Contracts.Repositories;
using BlackstonePos.Domain.Contracts.Services;
using BlackstonePos.Domain.Models;
using BlackstonePos.Domain.Models.Comparers;
using Metele.common.Contracts.Services;
using Metele.common.Models;
using Metele.common.Models.PaxTerminal;
using Microsoft.Ajax.Utilities;
using OrdersGateway.Filters;
using OrdersGateway.Infrastructure;
using OrdersGateway.Models;
using Order = BlackstonePos.Domain.Models.Order;
using Setting = BlackstonePos.Domain.Models.Setting;

namespace OrdersGateway.Controllers
{
    //[ApiExplorerSettings(IgnoreApi = true)]
    public class AdminController : ApiController
    {
        private readonly IPaymentService _paymentService;
        private readonly IMeteleService _meteleService;
        private readonly IBlackstonePosService _blackstonePosService;
        private readonly ICashierRepository _cashierRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly IAchPaymentRepository _achPaymentRepository;
        private readonly IAchTransactionRepository _achTransactionRepository;
        private readonly ISettingRepository _settingRepository;
        private readonly IAppLogoRepository _appLogoRepository;
        private readonly IApplicantRepository _applicantRepository;

        public AdminController(IBlackstonePosService blackstonePosService, 
                            ICashierRepository cashierRepository, 
                            IOrderRepository orderRepository, 
                            ISettingRepository settingRepository, 
                            IPaymentService paymentService, IAchPaymentRepository achPaymentRepository,
                            IAchTransactionRepository achTransactionRepository,IApplicantRepository applicantRepository,  IMeteleService meteleService, IAppLogoRepository appLogoRepository)
                        {
                            _blackstonePosService = blackstonePosService;
                            _cashierRepository = cashierRepository;
                            _orderRepository = orderRepository;
                            _settingRepository = settingRepository;
                            _paymentService = paymentService;
                           _achPaymentRepository = achPaymentRepository;
                           _achTransactionRepository = achTransactionRepository;
                           _applicantRepository = applicantRepository;
                           _meteleService = meteleService;
                          _appLogoRepository = appLogoRepository;
                        }


        #region Cashier Ops
       
        [HttpPost]
        public BaseResponse AddCashier(BlackstonePos.Domain.Models.Cashier cashier)
        {
            var addingCashierResult = _blackstonePosService.AddItem(_cashierRepository, cashier);

            var status = addingCashierResult != null ? 200 : 201;

            var message = addingCashierResult != null ? string.Empty : "Erros trying to add a cashier.";

            return new BaseResponse
            {
                Status = status,
                ErrorMessage = message
            };

            
        }

        [HttpPost]
        [ApiResponseDescriptor(typeof(BlackstonePos.Domain.Models.Cashier))]
        public DataResponse GetCashier(BlackstonePos.Domain.Models.Cashier cashier)
        {

             var cashierResult = _blackstonePosService.GetItem(_cashierRepository, cashier.Id);

             var status = cashierResult != null ? 200 : 201;

             var message = cashierResult != null ? string.Empty : "Cashier Not Found";

             var data = cashierResult.Id;

             return new DataResponse
             {
                 Data = data,
                 Status = status,
                 ErrorMessage = message
             };            
        }

        [HttpPost]
        public BaseResponse UpdateCashier(BlackstonePos.Domain.Models.Cashier cashier)
        {
           
            var updateResult = _blackstonePosService.Update(_cashierRepository, cashier);

            var status = updateResult ? 200 : 201;

            var message = updateResult? string.Empty : "Erros trying to update cashier info.";

            return new BaseResponse
            {
                Status = status,
                ErrorMessage = message
            };
        

        }

        [HttpPost]
        public BaseResponse DeleteCashier(BlackstonePos.Domain.Models.Cashier cashier)
        {

            var deleteResult = _blackstonePosService.Delete(_cashierRepository, cashier.Id);

            var status = deleteResult ? 200 : 201;

            var message = deleteResult ? string.Empty : "Erros trying to delete cashier.";

            return new BaseResponse
            {
                Status = status,
                ErrorMessage = message
            };
        }
    
        [HttpPost]
        [ApiResponseDescriptor(typeof(IEnumerable<BlackstonePos.Domain.Models.Cashier>))]
        public DataResponse GetAllCashiers(PosCredentials posRequest)
        {

            var allCashiers = _blackstonePosService.Get(_cashierRepository);

            var cashiersResult = allCashiers.Where(cashier => cashier.MerchantId == posRequest.MerchantId && cashier.IsMerchant.HasValue && !cashier.IsMerchant.Value).ToList();

            var distinctCashiers = cashiersResult.Distinct(new CashierComparer());

            var status = cashiersResult != null ? 200 : 201;

            var message = cashiersResult != null ? string.Empty : "Cashiers could not be retrieved.";

            return new DataResponse
            {
                Data = distinctCashiers,
                Status = status,
                ErrorMessage = message
            };
        }

        #endregion

        #region Orders Ops
        [HttpPost]
        [ApiResponseDescriptor(typeof(IEnumerable<Order>))]
        public DataResponse GetAllOrders(PosPageRequest posRequest)
        {
            var allOrders = _blackstonePosService.GetAllValidOrders(posRequest.MerchantId, posRequest.StartDate, posRequest.EndDate).ToList();

            allOrders.ForEach(order =>
            {
                order.PhoneNumber = order.PhoneNumber.MaskPhoneNumber();
            });

            var status = allOrders != null ? 200 : 201;

            var message = allOrders != null ? string.Empty : "Orders could not be retrieved.";

            var data = allOrders;

            return new DataResponse
            {
                Data = data,
                Status = status,
                ErrorMessage = message
            };
        }

        [HttpPost]
        [ApiResponseDescriptor(typeof(IEnumerable<OrderSummaryViewModel>))]
        public DataResponse GetAllOrdersSummary(PosPageRequest posRequest)
        {
            var allOrders = _blackstonePosService.GetAllValidOrders(posRequest.MerchantId, posRequest.StartDate, posRequest.EndDate).ToList();

            var result = GetOrdersSummary(allOrders);

            var status = result != null ? 200 : 201;

            var message = result != null ? string.Empty : "Orders could not be retrieved.";

            return new DataResponse
            {
                Data = result,
                Status = status,
                ErrorMessage = message
            };
        }

        [HttpPost]
        [ApiResponseDescriptor(typeof(IEnumerable<OrderViewModel>))]
        public DataResponse GetAllOrdersToExport(PosPageRequest posRequest)
        {

            var allOrders = _blackstonePosService.GetAllValidOrders(posRequest.MerchantId, posRequest.StartDate, posRequest.EndDate).ToList();

            var ordersResult = allOrders.UIMapTo<List<Order>, List<OrderViewModel>>();

            var ordersTotalsLine = GetOrderTotalsLine(allOrders);

            ordersResult.Add(ordersTotalsLine);

            var status = ordersResult != null ? 200 : 201;

            var message = ordersResult != null ? string.Empty : "Orders could not be retrieved.";

            return new DataResponse
            {
                Data = ordersResult,
                Status = status,
                ErrorMessage = message
            };
        }

        [HttpPost]
        [ApiResponseDescriptor(typeof(Order))]
        public DataResponse GetOrder(Order order)
        {
                var orderResult = _blackstonePosService.GetItem(_orderRepository, order.Id);

                var status = orderResult != null ? 200 : 201;

                var message = orderResult != null ? string.Empty : "Order Not Found";

                var data = orderResult;

                return new DataResponse
                {
                    Data = data,
                    Status = status,
                    ErrorMessage = message
                };
            
        }

        [HttpPost]
        public BaseResponse AddOrder(Order order)
        {

            var addingOrderResult = _blackstonePosService.AddItem(_orderRepository, order);

            var status = addingOrderResult != null ? 200 : 201;

            var message = addingOrderResult != null ? string.Empty : "Erros trying to add an order.";

            return new BaseResponse
            {
                Status = status,
                ErrorMessage = message
            };
        }

        [HttpPost]
        public BaseResponse RefundOrder(OrderActionRequest refundRequest)
        {
            var refundResponse = _blackstonePosService.RefundOrder(refundRequest.MerchantId, refundRequest.OrderId);

            return refundResponse;
        }

        [HttpPost]
        public BaseResponse ReSendOrderConfirmation(OrderActionRequest refundRequest)
        {
            try
            {
                var order = _blackstonePosService.GetReceiptResponse(new PaxTerminalTransactionRequest() { OrderId = refundRequest.OrderId }, new BrokerResponse());
                var errorMessage = "";
                

                return new DataResponse()
                {
                    Data = order,
                    ErrorMessage = string.IsNullOrEmpty(errorMessage) ? "Confirmation Number successfully re-sent" : errorMessage,
                    Status = string.IsNullOrEmpty(errorMessage) ? 200 : 201
                };
            }
            catch (Exception exception)
            {
                return new DataResponse(exception);
            } 
        }

        #endregion

        #region Settings

        [HttpPost]
        [ApiResponseDescriptor(typeof(Setting))]
        public DataResponse UpdateSettings(Setting setting)
        {
            try
            {
                var updateResult = _blackstonePosService.Update(_settingRepository, setting);

                if(!updateResult)
                    return new DataResponse
                    {
                        ErrorMessage = "Error trying to update settings!",
                        Status = 201
                    };

                var result = GetSettings(setting);

                return result;
            }
            catch (Exception exception)
            {
                return new DataResponse(exception);
            }

        }

        [HttpPost]
        [ApiResponseDescriptor(typeof(Setting))]
        public DataResponse GetSettings(PosCredentials posRequest)
        {
            try
            {
                var allsettings = _blackstonePosService.Get(_settingRepository);

                var setting = allsettings.FirstOrDefault(set => set.MerchantId == posRequest.MerchantId);

                if (setting == null)
                    AddNewDefaultSettings(posRequest);

                var status = setting != null ? 200 : 201;

                var message = setting != null ? string.Empty : "Setting could not be retrieved.";

                var data = setting;

                return new DataResponse
                {
                    Data = data,
                    Status = status,
                    ErrorMessage = message
                };
            }
            catch (Exception exception)
            {
                return new DataResponse(exception);
            }
        }

        private void AddNewDefaultSettings(PosCredentials posRequest)
        {
            var merchant = _blackstonePosService.FindMerchant(posRequest.MerchantId);

            var tax = merchant.IsFullCarga ? 0 : 7;
            var paxTerminalAsPrinter = !merchant.IsFullCarga;

            var newSetting = new Setting
            {
                MerchantId = posRequest.MerchantId,
                ConfirmPhone = true,
                MerchantPassword = posRequest.MerchantPassword,
                PaxTerminalAsPrinter = paxTerminalAsPrinter,
                SmallReceipt = true,
                Tax = tax
            };

            _settingRepository.Add(newSetting);
        }

        [HttpPost]
        [ApiResponseDescriptor(typeof (string))]
        public DataResponse GetAppMainLogoUrl(PosCredentials posRequest)
        {
            try
            {
                var cashier = _cashierRepository.FindCashier(posRequest.MerchantId, posRequest.MerchantPassword);

                //Extensible to more Brands upon rules definition...
                var brandKey = cashier.IsFullCarga ? "fullCarga" : "blackstonePos";

                var logoUrl = _appLogoRepository.GetAppLogoByBrandKey(brandKey);

                var data = logoUrl != null ? logoUrl.BrandAppLogoUrl : string.Empty;

                return new DataResponse
                {
                    Data = data, 
                    Status = logoUrl!= null? 200:201,
                    ErrorMessage = logoUrl!= null? string.Empty: "Errors trying to fetch the App Logo"
                };

            }
            catch (Exception exception)
            {
                return new DataResponse(exception);
            }
        }
        #endregion

        #region Fundings Ops

        [HttpPost]
        public BaseResponse AddAchFunds(AchPayment payment)
        {
            var nonCreditPayment = MapperHelper.UIMapTo<AchPayment, NonCreditPayment>(payment);

            var addFundsResponse = _paymentService.AddFoundsUsingPaymentAchBsPos(nonCreditPayment);

            var paymentId = _blackstonePosService.FindPayment(payment.AccountNumber, payment.RoutingNumber);

            payment.Id = paymentId;

            if (!addFundsResponse.WasSuccess)
                payment.Saved = false;//Assures the payment info is not modified since it was failed 

            var achPayment = GetAchPaymentInstance(nonCreditPayment);

            //Add or Update the Payment Info
            var newPayment = _blackstonePosService.AddItem(_achPaymentRepository, achPayment);

            var achTransaction = GetAchTransactionInstance(newPayment.Id, payment.Amount, addFundsResponse.WasSuccess, addFundsResponse.Message);

            //Add or Update the Payment Transaction
            _blackstonePosService.AddItem(_achTransactionRepository, achTransaction);

            var status = addFundsResponse.WasSuccess ? 200 : 201;

            var message = addFundsResponse.Message;

            return new BaseResponse
            {
                Status = status,

                ErrorMessage = !string.IsNullOrEmpty(message)? message: "Errors trying to add funds."
            };
        }

        [HttpPost]
        [ApiResponseDescriptor(typeof(IEnumerable<AchPayment>))]
        public DataResponse GetSavedAchPayments(PosCredentials posRequest)
        {
            var savedPayments = _blackstonePosService.GetSavedPayments(posRequest.MerchantId.ToString());

            return savedPayments;

        }

        #endregion

        #region Refunds


        #endregion

        #region Aux Ops
        private AchPayment GetAchPaymentInstance(NonCreditPayment nonCreditPayment)
        {
            var achPayment = new AchPayment
            {
                AccountNumber = nonCreditPayment.AccountNumber,
                RoutingNumber = nonCreditPayment.RoutingNumber,
                MerchantId = int.Parse(nonCreditPayment.MerchantId),
                Saved = nonCreditPayment.SaveAccount,
                Id = int.Parse(nonCreditPayment.Id),
                TimeStamp = DateTime.Now
                
            };

            return achPayment;
        }
       
        private AchTransaction GetAchTransactionInstance(int id, decimal amount, bool wasSuccess, string message)
        {
            var achTransactionResult = new AchTransaction
            {
                Amount = amount,
                PaymentId = id,
                Remarks = message,
                Status = wasSuccess,
                TimeSpan = DateTime.Now
            };

            return achTransactionResult;
        }

        private OrderSummaryViewModel GetOrdersSummary(List<Order> orders)
        {
            var transactions = orders.Count;
            
            //Transactions Not Refunded
            var totalSales = orders.Where(o => !o.Refunded.HasValue || !o.Refunded.Value)
                                   .Sum(o => o.Amount.HasValue ? o.Amount.Value : 0);
            var comissions = orders.Sum(o => o.Comission.HasValue ? o.Comission.Value : 0);
            var refunds = orders.Where(o => o.Refunded.HasValue && o.Refunded.Value)
                .Sum(o => o.Amount.HasValue ? o.Amount.Value : 0);

            var refundedCount = orders.Count(o => o.Refunded.HasValue && o.Refunded.Value);

            var result = new OrderSummaryViewModel
            {
                Comissions = comissions.ToString("C"),
                TotalSales = totalSales.ToString("C"),
                Refunds = refunds.ToString("C"),
                Transactions = transactions,
                RefundedCount = refundedCount
            };

            return result;

        }

        private OrderViewModel GetOrderTotalsLine(IEnumerable<Order> orders)
        {
            var allOrders = orders.ToList();

            var summary = GetOrdersSummary(allOrders);

            var result = new OrderViewModel
            {
                DateTime = "Totals",
                Amount = summary.TotalSales,
                //Comission = summary.Comissions,
                OrderNumber = summary.Transactions.ToString(),
                Refunded = summary.RefundedCount.ToString(),
                Product = ""
            };

            return result;
        }

        //private Order UpdateOrderRefundedStatus(Order order)
        //{
        //    try
        //    {
        //        //Pinless is the only one that may be Refunded (as per FullCarga requirement - this way makes the effort minimum in this moment - )
        //        if (order.ProductCategory != PosCategory.pinless.ToString())
        //            order.Refunded = true;
        //        return order;
        //    }
        //    catch (Exception exception)
        //    {
        //        return order;
        //    }
        //}

        #endregion

        #region External Operations

        [HttpPost]
        [ApiResponseDescriptor(typeof(string))]
        public DataResponse GetActivationExternalLogin(PosCredentials tokenRequest)
        {
            var token = _meteleService.GetActivationCenterTicketForCredentials(tokenRequest.MerchantId, tokenRequest.MerchantPassword);

            var url = string.Format("http://activationshop.com/account/externallogin?token={0}", token);

            return new DataResponse
            {
                Data = url, 
                Status = !string.IsNullOrEmpty(token)? 200: 201, 
                ErrorMessage = !string.IsNullOrEmpty(token)?string.Empty:
                "Could not retrieve Token for Activation Shop."
            };
        }

        [HttpPost]
        [ApiResponseDescriptor(typeof(string))]
        public DataResponse GetVonageExternalLogin(PosCredentials tokenRequest)
        {
            var token = _meteleService.GetVonageTicketForCredentials(tokenRequest.MerchantId, tokenRequest.MerchantPassword);

            var url = string.Format("http://vonage.pinserve.com/account/externallogin?token={0}", token);

            return new DataResponse
            {
                Data = url,
                Status = !string.IsNullOrEmpty(token) ? 200 : 201,
                ErrorMessage = !string.IsNullOrEmpty(token) ? string.Empty :
                "Could not retrieve Token for Vonage."
            };
        }

        #endregion

        #region Applicants
        
      
        #endregion

    }


}
