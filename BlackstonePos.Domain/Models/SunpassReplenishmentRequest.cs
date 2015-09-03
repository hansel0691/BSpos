using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BlackstonePos.Domain.Models;

namespace BlackstonePos.Domain.Models
{
    public class SunpassBalanceInfoRequest: PosCredentials
    {
        public string TransporderNumber { get; set; }
    }

    public class SunpassReplenishmentRequest : PosCredentials
    {
        public decimal Amount { get; set; }

        public string PurchaseId { get; set; }

        public string TransporderNumber { get; set; }
    }
}