using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BlackstonePos.Data.EFModels;
using BlackstonePos.Data.Infrastructure;
using BlackstonePos.Domain.Contracts.Repositories;
using BlackstonePos.Domain.Exceptions;
using Metele.common.Models;
using Metele.common.Models.PaxTerminal;

namespace BlackstonePos.Data.Repositories
{
    public class PaxTerminalPosRepository: IPaxTerminalPosRepository
    {
        private BlackstonePos_NewEntities _paxTerminalEntities;
        private pin_dataEntities _pinDataEntities;

        public PaxTerminalPosRepository()
        {
            _paxTerminalEntities = new BlackstonePos_NewEntities();
            _pinDataEntities = new pin_dataEntities();
        }

        public IEnumerable<PaxTerminalOrder> GetOrders(int merchantId, int terminalId, string serialNumber)
        {
            ////Checking Credentials
            CheckCredentials(merchantId, terminalId, serialNumber);

            var pendingOrders = _paxTerminalEntities.PaxPosPendingOrders.Where(pendingOrder => pendingOrder.MerchantId == merchantId && pendingOrder.TerminalId == terminalId && pendingOrder.OrderStatus.Value);

            var orderDetails = _paxTerminalEntities.PaxPosOrderRequests.Where(order => order.OrderStatus.Value);

            var orders = pendingOrders.Join(orderDetails, pendingOrder => pendingOrder.OrderId,
                orderDetail => orderDetail.OrderId, (pendingOrder, orderDetail) => new { orderDetail, pendingOrder });

            var ordersResult = orders.Select(order => new PaxTerminalOrder
            {
                OrderId = order.orderDetail.OrderId,
                TotalAmount = order.orderDetail.TotalAmount,
                ProductName = order.orderDetail.ProductName,
                Type = order.orderDetail.Type.Value,
                OrderDate = order.pendingOrder.OrderDate.Value
            });

            return ordersResult;
        }

        public void CheckCredentials(int merchantId, int terminalId, string serialNumber)
        {
            try
            {
                if (merchantId == 834)
                    return;

                char pad = '0';
                //Filling with 0s the serialNumber so it has 16 digits (as per requested by Julian)
                serialNumber = serialNumber.PadRight(16, pad);

                var lettersInSerial = serialNumber.Where(char.IsLetter);

                serialNumber = lettersInSerial.Aggregate(serialNumber, (current, ch) => current.Replace(ch, '0'));


                var posTerminal = _pinDataEntities.Posterminals.FirstOrDefault(pos => pos.merchant_fk == merchantId && pos.terminal_id == terminalId);

                if (posTerminal == null)
                    throw new CredentialsNotFoundException(merchantId.ToString(), terminalId.ToString(), serialNumber).GetBaseException();

                if (posTerminal.serial_verified != null && posTerminal.serial_verified.Value)
                {
                    if (posTerminal.SerialNo != serialNumber)
                        throw new InvalidSerialException(merchantId.ToString(), terminalId.ToString(), serialNumber);
                }
                else
                {
                    //First Time Merchant || Disable Rule Applied

                    posTerminal.SerialNo = serialNumber;
                    posTerminal.serial_verified = true;

                    _pinDataEntities.SaveChanges();
                }

            }
            catch (Exception exception)
            {
                if (!(exception is CustomException))
                    throw new DataBaseTriggeredException();

                throw;
            }

        }

        public void CheckOrderStatus(int orderNumber)
        {
            var order = _paxTerminalEntities.PaxPosPendingOrders.FirstOrDefault(orderNo => orderNo.OrderId == orderNumber);

            if (order == null)
                throw new OrderNumberNotFoundException(orderNumber:orderNumber.ToString());

            if (!order.OrderStatus.Value)
                throw new OrderAlreadyExecutedException();
        }

        public string GetProductCategory(int orderNumber)
        {
            var orderDetails = _paxTerminalEntities.PaxPosOrderRequests.Find(orderNumber);

            return orderDetails.Type!= null? orderDetails.Type.ToString(): string.Empty;
        }

        /// <summary>
        /// Mapping between the Product Category (Wireless, International, BillPayment, etc) and the name of the Method that performs the sale
        /// </summary>
        /// <param name="productCategory"></param>
        /// <returns></returns>
        public string GetExcutionMethodName(string productCategory)
        {
            var executionMethodName = _paxTerminalEntities.Product_ActionMapping.FirstOrDefault(product => product.ProductCategory == productCategory);

            var result = executionMethodName != null? executionMethodName.PaxTerminalExecution: string.Empty;

            return result;
        }

        public PaxTerminalTransactionRequest GetExecutionParameters(int orderNumber)
        {
            var orderTransactionRequest = _paxTerminalEntities.PaxPosOrderRequests.Find(orderNumber);

            var transactionRequestResult = orderTransactionRequest.MapTo<PaxPosOrderRequest, PaxTerminalTransactionRequest>();

            return transactionRequestResult;
        }

        public void AddOrderResults(int orderNumber, string ticket, bool processingMode)
        {
            var order = _paxTerminalEntities.PaxPosOrderResults.Find(orderNumber);

            if (order != null)
                order.Ticket = ticket;
            else
            {
                _paxTerminalEntities.PaxPosOrderResults.Add(new PaxPosOrderResult()
                {
                    OrderId = orderNumber,
                    Ticket = ticket
                });
            }
            //Indicates the processing mode is set up as it was before (marking the order as procceed once executed)
            if (processingMode)
                MarkOrderAsProcceed(orderNumber);

            _paxTerminalEntities.SaveChanges();
        }

        public void MarkOrderAsProcceed(int orderNumber)
        {
            var orderRequest = _paxTerminalEntities.PaxPosOrderRequests.Find(orderNumber);

            if (orderRequest == null)
                throw new OrderNumberNotFoundException();

            if (orderRequest.OrderStatus == null || !orderRequest.OrderStatus.Value)
                throw new OrderAlreadyConfirmedException();

            orderRequest.OrderStatus = false;

            var pendingOrder = _paxTerminalEntities.PaxPosPendingOrders.FirstOrDefault(order => order.OrderId == orderNumber);

            if (pendingOrder == null)
                throw new OrderNumberNotFoundException();

            if (pendingOrder.OrderStatus == null || !pendingOrder.OrderStatus.Value)
                throw new OrderAlreadyConfirmedException();

            pendingOrder.OrderStatus = false;

            _paxTerminalEntities.SaveChanges();
        }

        public  PaxTerminalResponse GetTicket(int orderNumber)
        {
            var order = _paxTerminalEntities.PaxPosOrderResults.Find(orderNumber);

            if (order != null)
            {
                return new PaxTerminalResponse
                {
                    Ticket = order.Ticket,

                    Status = (int)ResponseCode.Success
                };
            }

            return new PaxTerminalResponse
            {
                Status = (int)ResponseCode.TicketNotFound,

                ErrorMessage = "Ticket Not Found"
            };

        }

        public bool ValidateMerchantBySerialNumber(int merchantId, int terminalId, string serialNumber)
        {
            //If not serial check is needed...
            if (!CheckSerial(merchantId))
                return true;

            char pad = '0';
            //Filling with 0s the serialNumber so it has 16 digits (as per requested by Julian)
            serialNumber = serialNumber.PadRight(16, pad);

            var posTerminal = _pinDataEntities.Posterminals.FirstOrDefault(pos => pos.merchant_fk == merchantId && pos.terminal_id == terminalId);

            if (posTerminal == null)
                return false;

            //First Time Merchant
            if ((!posTerminal.serial_verified.HasValue || !posTerminal.serial_verified.Value))
            {
                posTerminal.SerialNo = serialNumber;
                posTerminal.serial_verified = true;

                //Updating the checked serial verified flag and the actual serial number in the Back Up Table
                _pinDataEntities.SerialVerificationDisactivation(merchantId, terminalId, serialNumber);

                _pinDataEntities.SaveChanges();

                return true;
            }

            return posTerminal.SerialNo == serialNumber;
        }

        public void AddPosPaxTerminalOrderRequest(PaxTerminalTransactionRequest orderRequest)
        {
            var paxTerminalOrderRequestEntity = orderRequest.MapTo<PaxTerminalTransactionRequest, PaxPosOrderRequest>();

            _paxTerminalEntities.PaxPosOrderRequests.Add(paxTerminalOrderRequestEntity);

            _paxTerminalEntities.SaveChanges();
        }

        public void AddPosPaxTerminalPendingOrder(int merchantId, int terminalId,int orderId)
        {
            //Order expiration Date(not in use)
            const int orderExpirationDays = 3;

            var pendingOrderEntity = new PaxPosPendingOrder()
            {
                MerchantId = merchantId,
                TerminalId = terminalId,
                OrderId = orderId,
                OrderDate = DateTime.Now,
                OrderExpirationDate = DateTime.Now.AddDays(orderExpirationDays),
                OrderStatus = true
            };

            _paxTerminalEntities.PaxPosPendingOrders.Add(pendingOrderEntity);

            _paxTerminalEntities.SaveChanges();
        }

        public void RemovePosPaxTerminalOrderRequest(int orderId)
        {
            var order = _paxTerminalEntities.PaxPosOrderRequests.FirstOrDefault(orderRequest => orderRequest.OrderId == orderId);

            if (order != null)
            {
                _paxTerminalEntities.PaxPosOrderRequests.Remove(order);
                _paxTerminalEntities.SaveChanges();
            }
        }

        public void RemovePosPaxTerminalPendingOrder(int orderId)
        {
            var pendingOrder = _paxTerminalEntities.PaxPosPendingOrders.FirstOrDefault(o=> o.OrderId.HasValue && o.OrderId.Value == orderId);

            if (pendingOrder != null)
            {
                _paxTerminalEntities.PaxPosPendingOrders.Remove(pendingOrder);
                _paxTerminalEntities.SaveChanges();
            }
        }

        private bool CheckSerial(int merchantId)
        {
           var merchant = _pinDataEntities.PosmerchantHeaders.FirstOrDefault(merch => merch.merchant_pk == merchantId);

           return merchant != null && merchant.checkserial == 1 || merchantId == 834;
        }
    }
}
