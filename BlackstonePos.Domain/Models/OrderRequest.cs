using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlackstonePos.Domain.Models
{
    public class OrderRequest
    {
        public string ProductMainCode { get; set; }
        public string VendorId { get; set; }
        public string AccountNumber { get; set; }
        public string AltAccountNumber { get; set; }
        public string AddInfo1 { get; set; }
        public string AddInfo2 { get; set; }
        public string CustomerName { get; set; }
        public string SenderName { get; set; }
        public string LicensePlate { get; set; }
        public string CountryCode { get; set; }
        public string PhoneNumber { get; set; }
        public double Amount { get; set; }
        public double Fee { get; set; }
        public string PurchaseId { get; set; }
        public string PaymentKeyWord { get; set; }
        public string OrderDate { get; set; }
        public string RequestKey { get; set; }
        public string SerialNumber { get; set; }
        public int MerchantId { get; set; }
        public int TerminalId { get; set; }
        public SystemType SystemType { get; set; }
    }

    public enum SystemType
    {
        Pax, Tnb
    }
}
