using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BlackstonePos.Domain.Models;
using Metele.common.Models.PaxTerminal;

namespace BlackstonePos.Domain.Contracts.Repositories
{
    public interface IPaxTerminalPosRepository
    {
        IEnumerable<PaxTerminalOrder> GetOrders(int merchantId, int terminalId, string serialNumber);
        void CheckCredentials(int merchantId, int terminalId, string serialNumber);
        void CheckOrderStatus(int orderNumber);
        string GetProductCategory(int orderNumber);
        string GetExcutionMethodName(string productCategory);
        PaxTerminalTransactionRequest GetExecutionParameters(int orderNumber);
        void AddOrderResults(int orderNumber, string ticket, bool processingMode);
        void MarkOrderAsProcceed(int orderNumber);
        PaxTerminalResponse GetTicket(int orderNumber);
        bool ValidateMerchantBySerialNumber(int merchantId, int terminalId, string serialNumber);
        void AddPosPaxTerminalOrderRequest(PaxTerminalTransactionRequest request);
        void AddPosPaxTerminalPendingOrder(int merchantId, int terminalId, int orderId);
        void RemovePosPaxTerminalOrderRequest(int orderId);
        void RemovePosPaxTerminalPendingOrder(int orderId);
    }
}
