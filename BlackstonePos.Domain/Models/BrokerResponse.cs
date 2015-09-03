using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Metele.common.Models;

namespace BlackstonePos.Domain.Models
{
    public class BrokerResponse
    {
        public string ErrorCode { get; set; }

        public string ErrorMessage { get; set; }

        public string TransactionID { get; set; }

        public string PinID { get; set; }

        public string ProductMainCode { get; set; }

        public string ProductDenomination { get; set; }

        public string PinNumber { get; set; }

        public string ControlNumber { get; set; }

        public string Language { get; set; }

        public string ProductSBT { get; set; }

        public string Conn800English { get; set; }

        public string CustomerServiceEnglish { get; set; }

        public string ItemFK { get; set; }

        public string TransactionMode { get; set; }

        public string ProductDescription { get; set; }

        public string Batch { get; set; }

        public string ExpirationDate { get; set; }

        public string ProductType { get; set; }

        public string Barcode { get; set; }

        public string Instructions { get; set; }

        public string PrinterDisclaimer { get; set; }

        public string ToppedUpNumber { get; set; }

        public string AccountNumber { get; set; }

        public double ForeignAmount { get; set; }

        public double ForeignMoneyLeft { get; set; }

        public string ReferenceNumber { get; set; }

        public string AuthorizationCode { get; set;  }

        public int OrderNumber { get; set; }
        public string CustomerService { get; set; }
        public IEnumerable<AccessNumber> LocalAccessPhones { get; set; }
        
    }
}
