using System;
using System.Web.Http.Filters;

namespace OrdersGateway.Filters
{
    public class ApiResponseDescriptor: ActionFilterAttribute
    {
        public Type ResponseType { get; set; }

        public ApiResponseDescriptor(Type descriptionType)
        {
            ResponseType = descriptionType;
        }
    }
}