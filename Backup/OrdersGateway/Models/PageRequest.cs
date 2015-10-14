using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BlackstonePos.Domain.Models;

namespace OrdersGateway.Models
{
    public class PosPageRequest: PosCredentials
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public int PageSize { get; set;  }

        public int PageNumber { get; set; }
    }
}