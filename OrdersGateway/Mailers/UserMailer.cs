using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;
using System.Web.UI.WebControls;
using BlackstonePos.Domain.Contracts.Services;
using BlackstonePos.Domain.Models;
using Metele.common.Contracts.Services;
using Metele.common.Models;
using Metele.utils.general;
using Mvc.Mailer;
using Ninject.Extensions.Logging;
using OrdersGateway.Models;

namespace OrdersGateway.Mailers
{
    public class UserMailer : MailerBase, IUserMailer
    {
        private readonly ILogger _logger;
        private readonly IBlackstonePosService _blackstoneService;
        public UserMailer(ILogger aLogger, IBlackstonePosService blackstoneService)
        {
            _logger = aLogger;
            _blackstoneService = blackstoneService;
        }

        public virtual MvcMailMessage EmailConfirmation(ReceiptResponse receipt, int merchantId, string email)
        {
            var merchant = _blackstoneService.FindMerchant(merchantId);

            return merchant.IsFullCarga
                ? EmailConfirmationForFullCarga(receipt, merchantId, GetReceiptConfigForFullCarga(email))
                : EmailConfirmationForBlackstonePos(receipt, GetReceiptConfigForBlackstone(email));
        }

        public MvcMailMessage ContactUsFollowUp(ContactUs contact)
        {

            ViewBag.ContactName = contact.Name;
            ViewBag.ContactEmail = contact.Email;
            ViewBag.ContactPhoneNumber = contact.Phone;
            ViewBag.ContactMessage = contact.Message;
            ViewBag.ContactSubject = contact.Subject;

            const string destination = "customerservice@blackstoneonline.com";

            return Populate(x =>
            {
                x.Subject = "New Contact Us Request";
                x.To.Add(destination);
                x.ViewName = "ContactUsFollowUp";
            });
        }

        public MvcMailMessage SendAttachment(string email, string attachmentFileName)
        {
            try
            {
                return Populate(x =>
                {
                    x.Subject = "Orders Attached";
                    x.To.Add(email);
                    x.ViewName = "OrdersAttached";
                    x.Attachments.Add(new Attachment(attachmentFileName));
                });
            }
            catch (Exception exception)
            {
                _logger.Error(exception.StackTrace);
                return null;
            }
        }

        private MvcMailMessage EmailConfirmationForFullCarga(ReceiptResponse receipt, int merchantId, ReceiptConfigViewModel receiptConfig)
        {
            try
            {
                var bodyMessageForFullCarga = _blackstoneService.GetFullCargaSmsFormat(receipt, merchantId);

                ServiceImplementationUtils.LoadDictionaryFromFormattedText(ViewData, bodyMessageForFullCarga);

                ViewBag.LogoUrl = receiptConfig.LogoUrl;
                ViewBag.Company = receiptConfig.Company;

                return Populate(x =>
                {
                    x.From = new MailAddress(receiptConfig.EmailId);
                    x.Subject = receiptConfig.Subject;
                    x.To.Add(receiptConfig.Email);
                    x.ViewName = "Confirmation";
                });
            }
            catch (Exception exception)
            {
                _logger.Error(exception.StackTrace);
                return null;
            }
        }

        private MvcMailMessage EmailConfirmationForBlackstonePos(ReceiptResponse receipt, ReceiptConfigViewModel receiptConfig)
        {
            try
            {
                receipt.PhoneNumber = ServiceImplementationUtils.GetAmericanFormat(receipt.PhoneNumber);

                //Filling the ViewData to be displayed in the email (ignoring the PhoneRecharged)
                ServiceImplementationUtils.LoadDictionaryfromType(ViewData, receipt);

                ViewBag.LogoUrl = receiptConfig.LogoUrl;
                ViewBag.Company = receiptConfig.Company;

                return Populate(x =>
                {
                    x.From = new MailAddress(receiptConfig.EmailId);
                    x.Subject = receiptConfig.Subject;                
                    x.To.Add(receiptConfig.Email);
                    x.ViewName = "Confirmation";
                });
            }
            catch (Exception exception)
            {
                _logger.Error(exception.StackTrace);
                return null;
            }
        }

        private ReceiptConfigViewModel GetReceiptConfigForBlackstone(string email)
        {
            var result = new ReceiptConfigViewModel
            {
                EmailId = @System.Configuration.ConfigurationManager.AppSettings["bsposMailId"],
                Company = "Blackstone POS",
                Email = email,
                LogoUrl = "http://mobile.blackstonepos.com/logos/pos-logo.png",
                Subject = "Blackstone POS Product Sale Confirmation"
            };

            return result;
        }

        private ReceiptConfigViewModel GetReceiptConfigForFullCarga(string email)
        {
            var result = new ReceiptConfigViewModel
            {
                EmailId = @System.Configuration.ConfigurationManager.AppSettings["fcusaMailId"],
                Company = "Full Carga",
                Email = email,
                LogoUrl = "http://mobile.blackstonepos.com/logos/fullCarga.png",
                Subject = "FCUSA Transaction Confirmation"
            };

            return result;
        }

    }
}