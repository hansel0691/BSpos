using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OrdersGateway.Models
{
        public class BaseWebRequest
        {
            public string SerialNumber { get; set; }

            public int MerchantId { get; set; }

            public int TerminalId { get; set; }
        }
}