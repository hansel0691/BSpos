using System;


namespace BlackstonePos.Domain.Models
{
    public class Order: PosCredentials
    {
        public int Id { get; set; }
        public string ProductMainCode { get; set; }
        public string ProductName { get; set; }
        public decimal? Amount { get; set; }
        public string OperatorName { get; set; }
        public string CountryCode { get; set; }
        public string PhoneNumber { get; set; }
        public int? TransactionID { get; set; }
        public string PinID { get; set; }
        public string PinNumber { get; set; }
        public string ControlNumber { get; set; }
        public string AuthorizationCode { get; set; }
        public bool? Status { get; set; }
        public string ErrorMessage { get; set; }
        public string BillerId { get; set; }
        public string AccountNumber { get; set; }
        public DateTime? TimeStamp { get; set; }
        public decimal? Comission { get; set; }
        public string TerminalId { get; set; }
        public string Source { get; set; }
        public string ConfirmationPhoneNumber { get; set; }
        public string ConfirmationMessage { get; set; }
        public bool? Refunded { get; set; }
        public string ProductCategory { get; set; }
        public bool IsRefundable
        {
            get
            {
                return IsResendable && !string.IsNullOrEmpty(ProductCategory) &&  ProductCategory == PosCategory.pinless.ToString();
            }
        }
        public bool IsResendable
        {
            get
            {
                return !Refunded.HasValue || !Refunded.Value;
            }
        }

    }
}
