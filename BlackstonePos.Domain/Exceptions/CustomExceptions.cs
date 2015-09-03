using System;
using Metele.common.Models.PaxTerminal;

namespace BlackstonePos.Domain.Exceptions
{
    public abstract class CustomException : Exception
    {
        public string MerchantId { get; set; }

        public string TerminalId { get; set; }

        public string SerialNumber { get; set; }

        protected CustomException(string merchantId="", string terminalId="", string serialNumber="")
        {
            MerchantId = merchantId;
            TerminalId = terminalId;
            SerialNumber = serialNumber;
        }
    }

    public class InvalidSerialException:CustomException
    {
        public InvalidSerialException(string merchantId="", string terminalId="", string serialNumber="") : base(merchantId, terminalId, serialNumber)
        {
        }

        public override string Message
        {
            get { return "Invalid Serial Number"; }
        }
    }
    public class CredentialsNotFoundException : CustomException
    {
        public CredentialsNotFoundException(string merchantId="", string terminalId="", string serialNumber="") : base(merchantId, terminalId, serialNumber)
        {
        }

        public override string Message
        {
            get { return "Invalid Credentials"; }
        }
    }

    public class OrderNumberNotFoundException : CustomException
    {
        public OrderNumberNotFoundException(string merchantId="", string terminalId="", string serialNumber="", string orderNumber = "") : base(merchantId, terminalId, serialNumber)
        {
        }

        public override string Message
        {
            get { return "Order Number Not Found"; }
        }
    }

    public class OrderAlreadyConfirmedException : CustomException
    {
        public OrderAlreadyConfirmedException(string merchantId="", string terminalId="", string serialNumber="") : base(merchantId, terminalId, serialNumber)
        {
        }

        public override string Message
        {
            get { return "Order Already Confirmed"; }
        }
    }

    public class OrderAlreadyExecutedException : CustomException
    {
        public OrderAlreadyExecutedException(string merchantId="", string terminalId="", string serialNumber="") : base(merchantId, terminalId, serialNumber)
        {
        }

        public override string Message
        {
            get { return "Order Already Executed"; }
        }
    }

    public class DelayOrderException:Exception
    {
        public PaxTerminalOrder OrderInfo { get; set; }

        public DelayOrderException(PaxTerminalOrder order)
        {
            OrderInfo = order;
        }
    }

    public class InvalidMappingException : Exception
    {
        public override string Message
        {
            get { return "Invalid Mapping"; }
        }
    }

    public class DataBaseTriggeredException: CustomException
    {
        public override string Message
        {
            get { return "Error Checking Credentials"; }
        }
    }
}