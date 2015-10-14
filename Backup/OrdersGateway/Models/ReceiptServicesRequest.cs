using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BlackstonePos.Domain.Models;

namespace OrdersGateway.Models
{
    public class ReceiptServicesRequest: PosCredentials
    {
        public ReceiptResponse Receipt { get; set; }
    }

    public class ReceiptSmsRequest : ReceiptServicesRequest
    {
        public string PhoneNumber { get; set; }
    }

    public class ReceiptEmailRequest : ReceiptServicesRequest
    {
        public string Email { get; set; }
    }

    public class OrdersByEmailRequest: PosCredentials
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Email { get; set; }
    }
}