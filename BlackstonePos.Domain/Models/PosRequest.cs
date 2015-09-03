

namespace BlackstonePos.Domain.Models
{
    public class PosRequest: PosCredentials
    {
        public string OperatorName { get; set; }
        public int ProfileId { get; set; }
        public int TerminalId { get; set; }
        public string ProductMainCode { get; set; }
        public string ProductName { get; set; }
        public decimal Amount { get; set; }
        public string OriginRequest { get; set; }
        public string CountryCode { get; set; }
        public string PhoneNumber { get; set; }

    }
}