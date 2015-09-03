using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BlackstonePos.Domain.Models
{
    public class BaseResponse
    {
        public int Status { get; set; }

        public string ErrorMessage { get; set; }

        public BaseResponse()
        {
            
        }

        public BaseResponse(Exception exception)
        {
            ErrorMessage = exception.Message;
            Status = 202;
        }

        public BaseResponse(Exception exception, string controller, string action)
        {
            var message = string.Format("Error performing action {0} in {1} controller. Problem ocurred: {2}", action, controller, exception.Message);

            ErrorMessage = message;
            Status = 202;
        }
    }
}