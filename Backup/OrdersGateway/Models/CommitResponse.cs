using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BlackstonePos.Domain.Models;

namespace OrdersGateway.Models
{
    public class CommitResponse : BaseResponse
    {
        public string Ticket { get; set; }
    }
}