using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Razor.Text;

namespace OrdersGateway.Models
{
    public class AchPaymentRequest
    {
        public int Id { get; set; }

        public string AccountNumber { get; set; }

        public string RoutingNumber { get; set; }

        public decimal Amount { get; set; }
    }
}