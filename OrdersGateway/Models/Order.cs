using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OrdersGateway.Models
{
    public class Order
    {
        public int OrderId { get; set; }

        public int Type { get; set; }

        public string TotalAmount { get; set; }

        public string ProductName { get; set; }
    }
}