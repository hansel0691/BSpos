using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OrdersGateway.Models
{
    public class OrderViewModel
    {
        public string DateTime { get; set; }
        public string OrderNumber { get; set; }
        public string PhoneNumber { get; set; }
        public string Product { get; set; }
        public string Amount { get; set; }
        //public string Comission { get; set; }
        public string Refunded { get; set; }
    }
}