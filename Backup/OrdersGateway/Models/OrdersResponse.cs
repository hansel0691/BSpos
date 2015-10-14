using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BlackstonePos.Domain.Models;

namespace OrdersGateway.Models
{
    public class OrdersResponse : BaseResponse
    {
        public IEnumerable<Order> Orders { get; set; }

        public int OrderCount { get { return Orders != null ? Orders.Count() : 0; } }
    }
}