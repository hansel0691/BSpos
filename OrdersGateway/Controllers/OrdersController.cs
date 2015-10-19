using System;
using System.Linq;
using System.Security.Cryptography;
using BlackstonePos.Domain.Contracts.Services;
using BlackstonePos.Domain.Exceptions;
using BlackstonePos.Domain.Models;
using log4net;
using Metele.common.Contracts.Services;
using Metele.common.Models.PaxTerminal;
using Ninject.Extensions.Logging;
using OrdersGateway.Filters;
using OrdersGateway.Models;
using System.Collections.Generic;
using System.Web.Http;
using OrdersGateway.Infrastructure;
using PinlessLib;
using WebGrease.Css.Ast.Selectors;
using CustomException = Metele.data.CustomExceptions.CustomException;
using Order = OrdersGateway.Models.Order;

namespace OrdersGateway.Controllers
{
    public class OrdersController : ApiController
    {
        private readonly IMeteleService _paxTerminalService;
        private readonly IBlackstonePosService _blackstonePosService;
        private readonly ILogger _logger;

        public OrdersController(IMeteleService aService, ILogger logger, 
                                IBlackstonePosService blackstonePosService)
        {
            _paxTerminalService = aService;
            _logger = logger;
            _blackstonePosService = blackstonePosService;
        }
        #region Main Operations

        [HttpPost]
        [SkipAuthentication]
        public OrdersResponse GetOrders(BaseWebRequest webRequest)
        {
            var isMeteleMerchant = IsMeteleUsaMerchant(webRequest.MerchantId);
            
            return isMeteleMerchant ? GetOrdersForMetele(webRequest): GetOrdersForBlackstonePos(webRequest);
        }

        [HttpPost]
        [SkipAuthentication]
        public CommitResponse AddOrder(OrderRequest orderRequest)
        {
            try
            {
                if (IsMeteleUsaMerchant(orderRequest.MerchantId))//Test purposes
                    return new CommitResponse
                    {
                        Status = 201,
                        ErrorMessage = "You cannot add orders from this source!"
                    };

                var validationResult = ValidateOrder(orderRequest);

                if (validationResult.Status != 200)
                    return validationResult;

                var paxTerminalRequest = MapOrderToPaxTerminalRequest(orderRequest);

                if (paxTerminalRequest == null)
                {
                    return new CommitResponse
                    {
                        ErrorMessage = "The Order has some invalid arguments",
                        Status = 201,
                    }; 
                }

                var response = _blackstonePosService.AddOrderForPaxTerminal(paxTerminalRequest);

                return new CommitResponse
                {
                    ErrorMessage = response.ErrorMessage,
                    Status = response.Status,
                    Ticket = response.Data.ToString() //It should bring back the Order Number
                };

            }
            catch (Exception exception)
            {
                var errorMessage = exception.Message;

                if (exception is CustomException)
                {
                    var customException = exception as CustomException;

                    _logger.Debug(string.Format("Operation:AddOrder,Error Message:{3}, Parameters:MerchantId:{0}," +
                                                "TerminalId:{1},SerialNumber:{2}", customException.MerchantId, customException.TerminalId, 
                                                 customException.SerialNumber, customException.Message));
                    errorMessage = customException.Message;
                }
                return new CommitResponse
                {
                    ErrorMessage = "Errors trying to Add new Order. " + errorMessage,
                    Status = 201,
                };
            }
            
        }

        [HttpPost]
        [SkipAuthentication]
        public CommitResponse ExecuteOrder([FromBody] OrdersWebRequest webRequest)
        {
            var isMeteleMerchant = IsMeteleUsaMerchant(webRequest.MerchantId);

            return isMeteleMerchant ? ExecuteOrderForMetele(webRequest) : ExecuteOrderForBlackstonePos(webRequest);
        }

        [HttpPost]
        [SkipAuthentication]
        public CommitResponse ExecuteOrderExt([FromBody] OrdersWebRequest webRequest)
        {
            var isMeteleMerchant = _paxTerminalService.IsMeteleMerchant(webRequest.MerchantId);

            return isMeteleMerchant ? ExecuteOrderExtForMetele(webRequest):ExecuteOrderExtForBlackstonePos(webRequest);
        }

        [HttpPost]
        [SkipAuthentication]
        public CommitResponse ReprintOrder([FromBody] OrdersWebRequest webRequest)
        {
            var isMeteleMerchant = _paxTerminalService.IsMeteleMerchant(webRequest.MerchantId);

            return isMeteleMerchant ? ReprintOrderForMetele(webRequest):ReprintOrderForBlackstonePos(webRequest);

        }

        [HttpPost]
        [SkipAuthentication]
        public CommitResponse ConfirmOrder([FromBody] OrdersWebRequest webRequest)
        {
            var isMeteleMerchant = _paxTerminalService.IsMeteleMerchant(webRequest.MerchantId);

            return isMeteleMerchant ? ConfirmOrderForMetele(webRequest): ConfirmOrderForBlackstonePos(webRequest);
        }
        #endregion

        #region Metele Pax Operations

        private OrdersResponse GetOrdersForMetele(BaseWebRequest webRequest)
        {
            try
            {
                var orders = _paxTerminalService.GetOrders(webRequest.MerchantId, webRequest.TerminalId, webRequest.SerialNumber).OrderByDescending(order => order.OrderDate);

                //Taking the first 100 orders on the queue
                if (orders.Count() > 100)
                    orders = (IOrderedEnumerable<PaxTerminalOrder>)orders.Take(100);

                var ordersResult = orders.UIMapTo<IEnumerable<PaxTerminalOrder>, IEnumerable<Order>>();

                return new OrdersResponse
                {
                    Status = 200,
                    Orders = ordersResult
                };
            }
            catch (Exception exception)
            {
                if (exception is CustomException)
                {
                    var customException = exception as CustomException;

                    _logger.Debug(string.Format("Operation:GetOrders,Error Message:{3}, Parameters:MerchantId:{0},TerminalId:{1},SerialNumber:{2}", customException.MerchantId, customException.TerminalId, customException.SerialNumber, customException.Message));
                }
                return new OrdersResponse
                {
                    ErrorMessage = exception.Message,
                    Status = 201,
                };
            }
        }

        private CommitResponse ExecuteOrderForMetele(OrdersWebRequest webRequest)
        {
            try
            {
                var orderResponse = _paxTerminalService.ExecuteOrder(webRequest.MerchantId, webRequest.TerminalId,
                    webRequest.OrderNumber, webRequest.SerialNumber, true);

                var orderResponseResult = orderResponse.UIMapTo<PaxTerminalResponse, CommitResponse>();

                return orderResponseResult;
            }

            catch (Exception exception)
            {
                if (exception is CustomException)
                {
                    var customException = exception as CustomException;

                    _logger.Debug(string.Format("Operation:ExecuteOrder,Error Message:{3}, Parameters:MerchantId:{0},TerminalId:{1},SerialNumber:{2}", customException.MerchantId, customException.TerminalId, customException.SerialNumber, customException.Message));
                }
                return new CommitResponse
                {
                    ErrorMessage = exception.Message,
                    Status = 201,
                };
            }
        }

        private CommitResponse ExecuteOrderExtForMetele(OrdersWebRequest webRequest)
        {
            try
            {
                var orderResponse = _paxTerminalService.ExecuteOrder(webRequest.MerchantId, webRequest.TerminalId,
                    webRequest.OrderNumber, webRequest.SerialNumber, false);

                var orderResponseResult = orderResponse.UIMapTo<PaxTerminalResponse, CommitResponse>();

                return orderResponseResult;
            }


            catch (Exception exception)
            {
                if (exception is CustomException)
                {
                    var customException = exception as CustomException;

                    _logger.Debug(string.Format("Operation:ExecuteOrderExt,Error Message:{3}, Parameters:MerchantId:{0},TerminalId:{1},SerialNumber:{2}", customException.MerchantId, customException.TerminalId, customException.SerialNumber, customException.Message));
                }
                return new CommitResponse
                {
                    ErrorMessage = exception.Message,
                    Status = 201,
                };
            }
        }

        private CommitResponse ReprintOrderForMetele(OrdersWebRequest webRequest)
        {
            try
            {
                var orderResponse = _paxTerminalService.RePrintOrder(webRequest.MerchantId, webRequest.TerminalId,
                    webRequest.OrderNumber, webRequest.SerialNumber);

                var orderResponseResult = orderResponse.UIMapTo<PaxTerminalResponse, CommitResponse>();

                return orderResponseResult;
            }

            catch (Exception exception)
            {
                if (exception is CustomException)
                {
                    var customException = exception as CustomException;

                    _logger.Debug(string.Format("Operation:ReprintOrder,Error Message:{3}, Parameters:MerchantId:{0},TerminalId:{1},SerialNumber:{2}", customException.MerchantId, customException.TerminalId, customException.SerialNumber, customException.Message));
                }
                return new CommitResponse
                {
                    ErrorMessage = exception.Message,
                    Status = 201,
                };
            }

        }

        private CommitResponse ConfirmOrderForMetele(OrdersWebRequest webRequest)
        {
            try
            {
                var confirmationResponse = _paxTerminalService.ConfirmOrder(webRequest.MerchantId, webRequest.TerminalId,
                    webRequest.OrderNumber, webRequest.SerialNumber);

                var orderResponseResult = confirmationResponse.UIMapTo<PaxTerminalResponse, CommitResponse>();

                return orderResponseResult;
            }
            catch (Exception exception)
            {
                if (exception is CustomException)
                {
                    var customException = exception as CustomException;

                    _logger.Debug(string.Format("Operation:ConfirmOrder,Error Message:{3}, Parameters:MerchantId:{0},TerminalId:{1},SerialNumber:{2}", customException.MerchantId, customException.TerminalId, customException.SerialNumber, customException.Message));
                }
                return new CommitResponse
                {
                    ErrorMessage = exception.Message,
                    Status = 201,
                };
            }
        }


        #endregion

        #region BSPos Pax Operations
        private OrdersResponse GetOrdersForBlackstonePos(BaseWebRequest webRequest)
        {
            try
            {
                var orders = _blackstonePosService.GetOrders(webRequest.MerchantId, webRequest.TerminalId, webRequest.SerialNumber).OrderByDescending(order => order.OrderDate).AsEnumerable<PaxTerminalOrder>();

                //Taking the first 100 orders on the queue
                if (orders.Count() > 100)
                    orders = orders.Take(100);

                var ordersResult = orders.UIMapTo<IEnumerable<PaxTerminalOrder>, IEnumerable<Order>>();

                return new OrdersResponse
                {
                    Status = 200,
                    Orders = ordersResult
                };
            }
            catch (Exception exception)
            {
                if (exception is CustomException)
                {
                    var customException = exception as CustomException;

                    _logger.Debug(string.Format("Operation:GetOrders,Error Message:{3}, Parameters:MerchantId:{0},TerminalId:{1},SerialNumber:{2}", customException.MerchantId, customException.TerminalId, customException.SerialNumber, customException.Message));
                }
                return new OrdersResponse
                {
                    ErrorMessage = string.Format("Errors trying to Retrieve the Orders.{0}",exception.Message),
                    Status = 201,
                };
            }
        }

        private CommitResponse ExecuteOrderForBlackstonePos(OrdersWebRequest webRequest)
        {
            try
            {
                var orderResponse = _blackstonePosService.ExecuteOrder(webRequest.MerchantId, webRequest.TerminalId,webRequest.OrderNumber, webRequest.SerialNumber, true);

                var orderResponseResult = orderResponse.UIMapTo<PaxTerminalResponse, CommitResponse>();

                return orderResponseResult;
            }

            catch (Exception exception)
            {
                //var errorMessage = string.Format("Errors trying to Execute the Order Number: {0}", webRequest.OrderNumber);

                if (exception is CustomException)
                {
                    var customException = exception as CustomException;

                    _logger.Debug(string.Format("Operation:ExecuteOrder,Error Message:{4}, Parameters:MerchantId:{0},TerminalId:{1},SerialNumber:{2}, OrderNumber: {3}", customException.MerchantId, customException.TerminalId, customException.SerialNumber, customException.OrderNumber, customException.Message));

                }
                return new CommitResponse
                {
                    ErrorMessage = exception.Message,
                    Status = 201,
                };
            }
        }

        private CommitResponse ExecuteOrderExtForBlackstonePos(OrdersWebRequest webRequest)
        {
            try
            {
                var orderResponse = _blackstonePosService.ExecuteOrder(webRequest.MerchantId, webRequest.TerminalId,
                    webRequest.OrderNumber, webRequest.SerialNumber, false);

                var orderResponseResult = orderResponse.UIMapTo<PaxTerminalResponse, CommitResponse>();

                return orderResponseResult;
            }


            catch (Exception exception)
            {
                if (exception is CustomException)
                {
                    var customException = exception as CustomException;

                    _logger.Debug(string.Format("Operation:ExecuteOrderExt,Error Message:{3}, Parameters:MerchantId:{0},TerminalId:{1},SerialNumber:{2}", customException.MerchantId, customException.TerminalId, customException.SerialNumber, customException.Message));
                }
                return new CommitResponse
                {
                    ErrorMessage = string.Format("Errors trying to Execute the Order Number: {0}", webRequest.OrderNumber),
                    Status = 201,
                };
            }
        }

        private CommitResponse ReprintOrderForBlackstonePos(OrdersWebRequest webRequest)
        {

            try
            {
                var orderResponse = _blackstonePosService.RePrintOrder(webRequest.MerchantId, webRequest.TerminalId,
                    webRequest.OrderNumber, webRequest.SerialNumber);

                var orderResponseResult = orderResponse.UIMapTo<PaxTerminalResponse, CommitResponse>();

                return orderResponseResult;
            }

            catch (Exception exception)
            {
                if (exception is CustomException)
                {
                    var customException = exception as CustomException;

                    _logger.Debug(string.Format("Operation:ReprintOrder,Error Message:{3}, Parameters:MerchantId:{0},TerminalId:{1},SerialNumber:{2}", customException.MerchantId, customException.TerminalId, customException.SerialNumber, customException.Message));
                }
                return new CommitResponse
                {
                    ErrorMessage = string.Format("Errors trying to Reprint the Order Number: {0}", webRequest.OrderNumber),
                    Status = 201,
                };
            }

        }

        private CommitResponse ConfirmOrderForBlackstonePos(OrdersWebRequest webRequest)
        {
            try
            {
                var confirmationResponse = _blackstonePosService.ConfirmOrder(webRequest.MerchantId, webRequest.TerminalId,
                    webRequest.OrderNumber, webRequest.SerialNumber);

                var orderResponseResult = confirmationResponse.UIMapTo<PaxTerminalResponse, CommitResponse>();

                return orderResponseResult;
            }
            catch (Exception exception)
            {
                if (exception is CustomException)
                {
                    var customException = exception as CustomException;

                    _logger.Debug(string.Format("Operation:ConfirmOrder,Error Message:{3}, Parameters:MerchantId:{0},TerminalId:{1},SerialNumber:{2}", customException.MerchantId, customException.TerminalId, customException.SerialNumber, customException.Message));
                }
                return new CommitResponse
                {
                    ErrorMessage = string.Format("Errors trying to Reprint the Order Number: {0}", webRequest.OrderNumber),
                    Status = 201,
                };
            }
        }

        #endregion

        #region Aux Functions
        private bool IsBlackstonePosMerchant(int merchantId)
        {
            var isBlaclakstonePos = _blackstonePosService.IsBlackstonePosMerchant(merchantId);

            return isBlaclakstonePos || merchantId == 834;
        }

        private CommitResponse ValidateOrder(OrderRequest orderRequest)
        {
            try
            {
                //Checking credentials
                ValidateCredentials(orderRequest);

                var errorMessage = _blackstonePosService.ValidatePosAddOrderRequest(orderRequest);

                return new CommitResponse
                {
                    ErrorMessage = string.IsNullOrEmpty(errorMessage) ? string.Empty : "The Order has some invalid arguments. " + errorMessage,
                    Status = string.IsNullOrEmpty(errorMessage) ? 200: 201,
                };  

            }
            catch (Exception exception)
            {
                return new CommitResponse
                {
                    ErrorMessage = exception.Message,
                    Status = 201
                };
            }
        }

        private void ValidateCredentials(OrderRequest orderRequest)
        {
            switch (orderRequest.SystemType)
            {
                case SystemType.Pax:
                {
                    _blackstonePosService.CheckCredentials(orderRequest.MerchantId, orderRequest.TerminalId, orderRequest.SerialNumber);
                    break;
                }
                    case  SystemType.Tnb:
                {
                    ValidateRequestKey(orderRequest);
                    break;
                }
                //Pending for Joel to send the System Type    
                default:
                {
                    _blackstonePosService.CheckCredentials(orderRequest.MerchantId, orderRequest.TerminalId, orderRequest.SerialNumber);
                    break;
                }
            }
        }

        private void ValidateRequestKey(OrderRequest orderRequest)
        {
            var requestKeyAssertion = Infrastructure.Utils.Md5Hash(orderRequest.MerchantId.ToString() + orderRequest.TerminalId.ToString() + orderRequest.OrderDate);

            if(!orderRequest.RequestKey.Equals(requestKeyAssertion))
                throw new InvalidSerialException(orderRequest.MerchantId.ToString(),orderRequest.TerminalId.ToString(), orderRequest.SerialNumber);
        }

        private PaxTerminalTransactionRequest MapOrderToPaxTerminalRequest(OrderRequest request)
        {
            try
            {
                var paxTerminalTransactionResult = new PaxTerminalTransactionRequest
                {
                    AccountNumber = request.AccountNumber,
                    AddInfo1 = request.AddInfo1,
                    AddInfo2 = request.AddInfo2,
                    AltAccountNumber = request.AltAccountNumber,
                    CashierId = request.MerchantId.ToString(),
                    Country = request.CountryCode,
                    CustomerName = request.CustomerName,
                    Fee = request.Fee,
                    LicensePlate = request.LicensePlate,
                    OrderDate = request.OrderDate!= null? DateTime.Parse(request.OrderDate): DateTime.Now,
                    PaymentKeyWord = request.PaymentKeyWord,
                    PhoneNumber = request.PhoneNumber,
                    ProductId = request.ProductMainCode,
                    SenderName = request.SenderName,
                    PurchaseId = request.PurchaseId,
                    SerialNumber = request.SerialNumber,
                    TerminalId = request.TerminalId.ToString(),
                    TotalAmount = request.Amount.ToString(),
                    VendorId = request.VendorId
                };

                return paxTerminalTransactionResult;
            }
            catch (Exception exception)
            {
                return null;
            }
        
        }

        private bool IsMeteleUsaMerchant(int merchantId)
        {
            return _paxTerminalService.IsMeteleMerchant(merchantId) && merchantId != 834;
        }

        #endregion

        #region Test

        [HttpGet]
        [SkipAuthentication]
        public CommitResponse AddOrderTest()
        {
            var newOrderRequest = new OrderRequest
            {
                ProductMainCode = "300595",
                Amount = 2,
                Fee = 0,
                OrderDate = "7/16/2015 3:19:10 PM",
                SerialNumber = "01234567890ABCDEF",
                MerchantId = 834,
                TerminalId = 10000642
            };

            var result =  AddOrder(newOrderRequest);

            return result;
        }

        #endregion

    }
}