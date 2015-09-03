using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BlackstonePos.Domain.Models;

namespace OrdersGateway.Models
{
    public class PosCategoryRequest: PosRequest
    {
        public int Category { get; set; }
    }
}