namespace BlackstonePos.Domain.Models
{
    public class DocumentsInquiryRequest: PosCredentials
    {
        public string LicensePlate { get; set; }

        public string DocumentId { get; set; }
    }

    public class DocumentsPaymentRequest : DocumentsInquiryRequest
    {
        public DocumentPaymentType PaymentType { get; set; }
    }

    public enum DocumentPaymentType
    {
        All, Single
    }

}
