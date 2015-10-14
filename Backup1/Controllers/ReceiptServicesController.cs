using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using BlackstonePos.Domain.Contracts.Services;
using BlackstonePos.Domain.Models;
using OrdersGateway.Infrastructure;
using OrdersGateway.Mailers;
using OrdersGateway.Models;
using Order = BlackstonePos.Domain.Models.Order;

namespace OrdersGateway.Controllers
{
    //[ApiExplorerSettings(IgnoreApi = true)]
    public class ReceiptServicesController : ApiController
    {
        private readonly IBlackstonePosService _blackstonePosService;
        private readonly IUserMailer _userMailer;

        public ReceiptServicesController(IBlackstonePosService blackstonePosService, IUserMailer userMailer)
        {
            _blackstonePosService = blackstonePosService;
            _userMailer = userMailer;
        }

        [HttpPost]
        public BaseResponse SendConfirmationSms(ReceiptSmsRequest request)
        {
            var serviceResponse = _blackstonePosService.SendSmsConfirmation(request.Receipt, request.MerchantId, request.PhoneNumber);

            return serviceResponse;
        }

        [HttpPost]
        public BaseResponse SendConfirmationEmail(ReceiptEmailRequest request)
        {
            _userMailer.EmailConfirmation(request.Receipt, request.MerchantId, request.Email).Send();

            return new BaseResponse
            {
                Status = 200,
                ErrorMessage = "Confirmation Email Successfully Sent"
            };
        }

        [HttpPost]
        public BaseResponse SendOrdersByEmail(OrdersByEmailRequest orderByEmailRequest)
        {
            var orders = _blackstonePosService.GetAllValidOrders(orderByEmailRequest.MerchantId,
                orderByEmailRequest.StartDate, orderByEmailRequest.EndDate).ToList();

            var ordersViewModel = orders.UIMapTo<IEnumerable<BlackstonePos.Domain.Models.Order>, IEnumerable<OrderViewModel>>().ToList();

            var ordersTotalsLine = GetOrderTotalsLine(orders);

            ordersViewModel.Add(ordersTotalsLine);

            var fileName = HttpContext.Current.Server.MapPath("/App_Data/Reports/orders.csv");

            _blackstonePosService.ExportToCsvFile(ordersViewModel, fileName);

            _userMailer.SendAttachment(orderByEmailRequest.Email, fileName).Send();

            return new BaseResponse
            {
                Status = 200,
                ErrorMessage = "Orders Sent By Email Successfully",
            };
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
                Comissions = comissions.ToString("$0.00"),
                TotalSales = totalSales.ToString("$0.00"),
                Refunds = refunds.ToString("$0.00"),
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
                Product = "-",
                PhoneNumber = "-"
            };

            return result;
        }

    }
}
