using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http.Filters;
using System.Web.Mvc;
using BlackstonePos.Domain.Models;

namespace OrdersGateway.Filters
{
    public class ExceptionInterceptor : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {
            var controllerName = actionExecutedContext.ActionContext.ControllerContext.ControllerDescriptor.ControllerName;

            var actionName = actionExecutedContext.ActionContext.ActionDescriptor.ActionName;

           actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(HttpStatusCode.OK, new DataResponse(actionExecutedContext.Exception,controllerName, actionName));

           actionExecutedContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");
        }

    }
}