using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlackstonePos.Domain.Models
{
    public static class DomainCommonValues
    {
        public static List<string> TopUpKeyWords
        {
            get
            {
                return new List<string> { "TOP UP", "TOP-UP"};
            }
        }
        public static List<string> PinlessKeyWords
        {
            get
            {
                return new List<string> { "Pinless"};
            }
        }

        public static string BillPaymentKeyword
        {
            get { return "BILL PAYMENT"; }
        }

        public static string SunpassKeyWord
        {
            get { return "SUNPASS"; }   
        }

        public static string SunpassDocumentKeyWord
        {
            get
            {
                return "FDOT DOCUMENT";
            }
        }

    }
}
