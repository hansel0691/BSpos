using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OrdersGateway.Models
{
    public class SalesWebRequest: BaseWebRequest
    {
        public string StartDate { get; set; }

        public string EndDate { get; set;}

        public int DateType { get; set; }
    }
}