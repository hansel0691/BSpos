using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Metele.common.Models;

namespace BlackstonePos.Domain.Models
{
    public class ReceiptResponse
    {

        #region Product Related
        public string ProductMainCode { get; set; }
        public string ProductName { get; set; }
        public string ProductCountry { get; set; }
        public string CarrierName { get; set; }
        public string ProductInstructions { get; set; }
        #endregion

        #region Pin/Top Up Related

        public string PinNumber { get; set; }
        public string ControlNumber { get; set; }
        public int OrderNumber { get; set; }
        public string TransactionId { get; set; }
        public IEnumerable<AccessNumber> LocalPhones { get; set; }
        public string ExpirationDate { get; set; }
        public string CustomerService { get; set; }
        public string AccessNumber { get; set; }
        #endregion

        #region Sunpass / Bill Payment Related
        public string UpdatedBalance { get; set; }
        public string AccountNumber { get; set; }
        public string LicensePlate { get; set; }
        #endregion

        #region Merchant Related
        public int MerchantId { get; set; }
        public string MerchantName { get; set; }
        public string MerchantPhoneNumber { get; set; }
        public string CashierName { get; set; }
        public string MerchantAddress { get; set; }
        public DateTime OrderDate { get; set; }
        #endregion

        #region Product Sale Related
        public string PhoneNumber { get; set; }
        public decimal Amount { get; set; }
        public decimal Fee { get; set; }
        public decimal Tax { get; set; }
        public decimal Total{get { return Amount + Fee + Tax; } }
        #endregion

   
    }
}