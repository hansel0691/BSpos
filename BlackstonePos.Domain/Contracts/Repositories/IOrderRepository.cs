using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BlackstonePos.Domain.Models;
using Metele.common.Models;
using Metele.common.Models.PaxTerminal;

namespace BlackstonePos.Domain.Contracts.Repositories
{
    public interface IOrderRepository: IBaseRepository<Order>
    {
        Order GetNewSinglePinOrderInstance(PosRequest singlePinRequest);

        Order GetNewTopUpOrderInstance(PosRequest topUpRequest);

        Order GetNewBillPaymentOrderInstance(PosBillPaymentRequest billPaymentRequest);

        IEnumerable<Order> GetSalesReport(int merchantId, string terminalId,  DateTime startDate, DateTime endDate);
        
        IEnumerable<Order> GetSalesReport(int merchantId, string terminalId, string startDate, string endDate);

        Order GetOrderFromPaxTerminalRequest(PaxTerminalTransactionRequest transactionRequest);
        void MarkOrderAsRefunded(int orderId);
        void UpdateOrderConfirmationData(int orderId, string phoneNumber, string confirmationMessage);
    }
}
