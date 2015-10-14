using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OrdersGateway.Models
{
    public class ReceiptConfigViewModel
    {
        /// <summary>
        /// represent the field from in the confirmation email.
        /// </summary>
        public string EmailId { get; set; }

        public string Company { get; set; }
        public string Subject { get; set; }
        public string LogoUrl { get; set; }
        public string Email { get; set; }
    }
}