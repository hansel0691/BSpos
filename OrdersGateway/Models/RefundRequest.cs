using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BlackstonePos.Domain.Models;

namespace OrdersGateway.Models
{
    public class OrderActionRequest: PosCredentials
    {
        public int OrderId { get; set; }
    }
}