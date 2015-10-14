using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BS.Services.com.blackstoneonline.services;
using Metele.common.Models.Products.BillPayment;

namespace OrdersGateway.Models
{
    public class PosMasterBiller
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string CategoryId { get; set; }

        public int AccountNumberMinLength { get; set; }

        public int AccountNumberMaxLength { get; set; }

        public double MinAmount { get; set; }

        public double MaxAmount { get; set; }

        public string AccountNumber { get; set; }

        public double Amount { get; set; }

        public double Fee { get; set; }

        public double Total { get; set; }

        public bool FormFlag { get; set; }

        public bool SenderNameRequired { get; set; }

        public bool CustomerNameRequired { get; set; }

        public bool HasPresentment { get; set; }

        public bool AddInfoLabel1Required { get; set; }

        public bool AddInfoLabel2Required { get; set; }

        public bool MaskAccountOnReceipt { get; set; }

        public bool AltLookUpRequired { get; set; }

        public string SenderNameAmountRequired { get; set; }

        public string CustomerName { get; set; }

        public string SenderName { get; set; }

        public string AltLookUpLabel { get; set; }

        public string AltLookUpMinLength { get; set; }

        public string AltLookUpMaxLength { get; set; }

        public string AddInfoLabel1 { get; set; }

        public string AddInfoLabel1Type { get; set; }

        public string AddInfoLabel1MinLength { get; set; }

        public string AddInfoLabel1MaxLength { get; set; }

        public string AddInfoLabel2 { get; set; }

        public string AddInfoLabel2Type { get; set; }

        public string AddInfoLabel2MinLength { get; set; }

        public string AddInfoLabel2MaxLength { get; set; }

        public string AltLookUp { get; set; }

        public string AddInfo1 { get; set; }

        public string AddInfo2 { get; set; }

        public string PaymentType { get; set; }

        public string RemitTimming { get; set; }

        public string ProductId { get; set; }

        public string ProductMainCode { get; set; }

        public string PostingTime { get; set; }

        public IEnumerable<BillerPaymentOption> PaymentOptions { get; set; }
    }
}