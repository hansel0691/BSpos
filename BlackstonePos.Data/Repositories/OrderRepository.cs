using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BlackstonePos.Data.EFModels;
using BlackstonePos.Data.Infrastructure;
using BlackstonePos.Domain.Contracts.Repositories;
using BlackstonePos.Domain.Models;
using Metele.common.Models.PaxTerminal;
using Order = BlackstonePos.Domain.Models.Order;

namespace BlackstonePos.Data.Repositories
{
    public class OrderRepository: BaseRepository<Order, EFModels.Order>, IOrderRepository
    {
        private readonly pin_dataEntities _pinDataEntities;

       public OrderRepository()
        {
            _dbContext = new BlackstonePos_NewEntities();

            _dbSet = (_dbContext as BlackstonePos_NewEntities).Orders;

           _pinDataEntities = new pin_dataEntities();
        }

       public Order GetNewSinglePinOrderInstance(PosRequest singlePinRequest)
       {
           var order = singlePinRequest.MapTo<PosRequest, Order>();

           order.Comission = GetMerchantComission(singlePinRequest.MerchantId, singlePinRequest.ProductMainCode, singlePinRequest.Amount);

            return order;
        }

        public Order GetOrderFromPaxTerminalRequest(PaxTerminalTransactionRequest transactionRequest)
        {
            try
            {
                var newOrder = new Order
                {
                    AccountNumber = transactionRequest.AccountNumber,
                    CountryCode = transactionRequest.Country,
                    PhoneNumber = transactionRequest.PhoneNumber,
                    Amount = decimal.Parse(transactionRequest.TotalAmount),
                    BillerId = transactionRequest.VendorId,
                    MerchantId = int.Parse(transactionRequest.CashierId),
                    TerminalId = transactionRequest.TerminalId,
                    ProductMainCode = transactionRequest.ProductId,
                    ProductName = transactionRequest.ProductName,
                    TimeStamp = DateTime.Now,
                    Status = false,
                    Comission = GetMerchantComission(int.Parse(transactionRequest.CashierId),transactionRequest.ProductId, decimal.Parse(transactionRequest.TotalAmount))
                };

                return newOrder;

            }
            catch (Exception exception)
            {
                return null;
            }
        }

        public void MarkOrderAsRefunded(int orderId)
        {
            var order = _dbSet.Find(orderId);

            order.Refunded = true;

            _dbContext.SaveChanges();
        }

        public void UpdateOrderConfirmationData(int orderId, string phoneNumber, string confirmationMessage)
        {
            var order = _dbSet.Find(orderId);

            if (order != null)
            {

                order.ConfirmationPhoneNumber = phoneNumber;
                order.ConfirmationMessage = confirmationMessage;

                _dbContext.SaveChanges();
            }
        }
        public Order GetNewTopUpOrderInstance(PosRequest topUpRequest)
       {
           var newOrder = GetNewSinglePinOrderInstance(topUpRequest);

           newOrder.PhoneNumber = topUpRequest.PhoneNumber;

           newOrder.CountryCode = topUpRequest.CountryCode;

           newOrder.Comission = GetMerchantComission(topUpRequest.MerchantId, topUpRequest.ProductMainCode, topUpRequest.Amount);

           return newOrder;
       }

        public Order GetNewBillPaymentOrderInstance(PosBillPaymentRequest billPaymentRequest)
        {
            var order = billPaymentRequest.MapTo<PosBillPaymentRequest, Order>();

            order.ProductName = "Bill Payment";

            order.Comission = GetMerchantComission(billPaymentRequest.MerchantId, billPaymentRequest.ProductMainCode,
                                                   Convert.ToDecimal(billPaymentRequest.Amount));
            return order;
        }

        public IEnumerable<Order> GetSalesReport(int merchantId, string terminalId, DateTime startDate, DateTime endDate)
        {
            if (startDate == DateTime.Today)
                return GetTodaySalesReport(merchantId, terminalId);

            return GetPastSalesReport(merchantId, startDate, endDate);
        }

        public IEnumerable<Order> GetSalesReport(int merchantId, string terminalId, string startDate, string endDate)
        {
            return !IsValidDateRange(startDate, endDate) ? new List<Order>() : 
                GetSalesReport(merchantId, terminalId, DateTime.Parse(startDate), DateTime.Parse(endDate));
        }

        private int GetMerchantComission(int merchantId, string productMainCode, decimal amount)
        {
            var comission = (_dbContext as BlackstonePos_NewEntities).sp_get_merchant_commission(merchantId, productMainCode, amount, 0);

            return comission;
        }

        private IEnumerable<Order> GetPastSalesReport(int merchantId, DateTime startDate, DateTime endDate)
        {
            var posInvoiceHeaders =
                _pinDataEntities.posinvoiceheaders.Where(
                    p => p.merchant_fk == merchantId && p.inv_date >= startDate && p.inv_date <= endDate);

            var posInvoiceDetails = _pinDataEntities.posinvoicedetails;

            var filteredDetails = posInvoiceHeaders.Join(posInvoiceDetails, a => a.inv_id, b => b.inv_id,
                (header, detail) => detail).ToList();

            var orders = Get().Where(o => o.MerchantId == merchantId && o.TimeStamp >= startDate && o.TimeStamp <= endDate).ToList();

            var orders_details = orders.Join(filteredDetails, a => a.TransactionID, b => b.inv_transaction_fk, GetOrderFromDetail);

            return orders_details;

        }

        private Order GetOrderFromDetail(Order order, posinvoicedetail invoiceDetail)
        {
            var orderRecovered = new Order
            {
                Id = order != null ? order.Id : invoiceDetail.inv_id,
                Amount = invoiceDetail.topup_loaded_amount.HasValue && invoiceDetail.topup_loaded_amount.Value != 0
                    ? invoiceDetail.topup_loaded_amount
                    : invoiceDetail.pro_denomination,
                ControlNumber = invoiceDetail.inv_pin_controlno.ToString(),
                PinID = invoiceDetail.inv_pin_fk.ToString(),
                OperatorName = invoiceDetail.inv_Cashier,
                PhoneNumber = invoiceDetail.phone_number,
                TransactionID = invoiceDetail.inv_transaction_fk,
                TimeStamp = invoiceDetail.inv_det_date,
                ProductMainCode = invoiceDetail.product_sbt,
                ProductName = invoiceDetail.pro_description,
                Status = true                
            };

            return orderRecovered;
        }

        private IEnumerable<Order> GetTodaySalesReport(int merchantId, string terminalId)
        {
            var allOrders = Get();

            var resultOrders = allOrders.Where(order => order.Status.HasValue && order.Status.Value 
                                               && order.TimeStamp.HasValue && order.TimeStamp.Value.Date == DateTime.Today
                                               && order.MerchantId == merchantId && order.TerminalId == terminalId);

            return resultOrders;
        }

        private bool IsValidDateRange(string startDate, string endDate)
        {
            try
            {
                DateTime start, end;

                return DateTime.TryParse(startDate, out start) && DateTime.TryParse(endDate, out end);

            }
            catch (Exception exception)
            {
                return false;
            }
        }

    }
}
