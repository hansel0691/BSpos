using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BlackstonePos.Domain.Models;
using Metele.common.Models;
using Mvc.Mailer;

namespace OrdersGateway.Mailers
{
    public interface IUserMailer
    {
        MvcMailMessage EmailConfirmation(ReceiptResponse receipt, int merchantId, string email);

        MvcMailMessage ContactUsFollowUp(ContactUs contact);

        MvcMailMessage SendAttachment(string email, string attachmentFileName);
    }
}
