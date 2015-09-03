

namespace BlackstonePos.Domain.Models
{
    public class PosBillPaymentRequest: PosCredentials
    {
        public string CategoryId { get; set; }
        public string BillerId { get; set; }
        public string AccountNumber { get; set; }
        public double Amount { get; set; }
        public double PaymentFee { get; set; }
        public string CustomerName { get; set; }
        public string SenderName { get; set; }
        public string AltLookUp { get; set; }
        public string AddInfo1 { get; set; }
        public string AddInfo2 { get; set; }
        public string ProductMainCode { get; set; }
    }
}