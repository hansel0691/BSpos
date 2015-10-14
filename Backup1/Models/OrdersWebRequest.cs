using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OrdersGateway.Models
{
    public class OrdersWebRequest : BaseWebRequest
    {
        public int OrderNumber { get; set; }
    }
}