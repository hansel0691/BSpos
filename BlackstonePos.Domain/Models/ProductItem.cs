using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlackstonePos.Domain.Models
{
  
    public class ProductItem
    {
        public string Code { get; set; }

        /// <remarks/>
        public string Name { get; set; }

        /// <remarks/>
        public bool UseFixedDenominations { get; set; }

        public bool IsTopUp { get; set; }

        /// <remarks/>
        public double MinDenomination { get; set; }

        /// <remarks/>
        public double MaxDenomination { get; set; }

        /// <remarks/>
        public string CarrierName { get; set; }

        /// <remarks/>
        public string CountryCode { get; set; }

        /// <remarks/>
        public string CountryName { get; set; }

        /// <remarks/>
        public string Type { get; set; }

        /// <remarks/>
        public string ImageUrl { get; set; }

        /// <remarks/>
        public string DialCountryCode { get; set; }

        /// <remarks/>
        public string TermsAndConditions { get; set; }

        /// <remarks/>
        public int MerchantBuyingFrequency { get; set; }

        /// <remarks/>
        public int ZipCodeBuyingFrequency { get; set; }

        public string MainCategory { get; set; }

        public string Instructions { get; set; }

        public bool ShowRates { get; set; }

        public bool ShowTerms { get; set; }

        public bool ShowInstructions { get; set; }

        public bool ShowAccessNumbers { get; set; }

        public IEnumerable<double> Denominations  { get; set; }

        public IEnumerable<DenominationsConfig> DenominationsConfig { get; set; }

        public bool AcceptAdditionalPhones { get; set; }
        public int AdditionalPhonesQuantity { get; set; }
        public double Fee { get; set; }
        
    }

    public enum ProductType
    {
        SinglePin, TopUp, SunpassReplenishment, SunpassDocument, BillPayment
    }
}
