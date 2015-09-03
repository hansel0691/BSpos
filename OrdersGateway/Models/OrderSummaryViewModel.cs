using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OrdersGateway.Models
{
    public class OrderSummaryViewModel
    {
        public int Transactions { get; set; }
        public string TotalSales { get; set; }
        public string Comissions { get; set; }
        public string Refunds { get; set; }
        public int RefundedCount { get; set; }
    }
}