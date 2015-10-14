using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace OrdersGateway.Filters
{
    public class CORSInterceptor : ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            //Enabling CORS so Out of Origin Request could be done (http://enable-cors.org/server_aspnet.html) 
            if (actionContext.Response != null && !actionContext.Response.Headers.Contains("Access-Control-Allow-Origin"))
            {
                actionContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            }
        }

        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            //Enabling CORS so Out of Origin Request could be done (http://enable-cors.org/server_aspnet.html) 
            if (actionExecutedContext.Response != null && !actionExecutedContext.Response.Headers.Contains("Access-Control-Allow-Origin"))
            {
                actionExecutedContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            }
        }
    }
}