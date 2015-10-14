using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using BlackstonePos.Domain.Contracts.Services;
using BlackstonePos.Domain.Models;
using BS.Services.Contracts_Implementation;
using Newtonsoft.Json;
using Ninject.Modules;

namespace OrdersGateway.Filters
{
    public class LogInterceptor: ActionFilterAttribute
    {
        private readonly IBlackstonePosService _blackstonePosService;

        public LogInterceptor()
        {
            var dependencyResolver = new MyDependencyResolver();

            _blackstonePosService = (BlackstonePosService)dependencyResolver.GetService(typeof (IBlackstonePosService));
        }

        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            var controllerName = actionContext.ControllerContext.ControllerDescriptor.ControllerName;

            var actionName = actionContext.ActionDescriptor.ActionName;

            var parameters = actionContext.ActionArguments;

            var thread = string.Format("{0}_{1}", actionName, GetRequestId(actionContext.Request));

            _blackstonePosService.LogInfo(controllerName, thread,"Starting", parameters);

        }

        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {

            var controllerName = actionExecutedContext.ActionContext.ControllerContext.ControllerDescriptor.ControllerName;

            var actionName = actionExecutedContext.ActionContext.ActionDescriptor.ActionName;

            var parameters = actionExecutedContext.ActionContext.ActionArguments;

            var dataResponse = GetDataResponse(actionExecutedContext);

            var thread = string.Format("{0}_{1}", actionName, GetRequestId(actionExecutedContext.Request));

            if (actionExecutedContext.Exception != null)
                _blackstonePosService.LogDebug(controllerName, thread, actionExecutedContext.Exception);
            else
            {
                if (dataResponse == null)
                    _blackstonePosService.LogInfo(controllerName, thread, "Exiting", parameters);
                else
                {
                    var dataJson = JsonConvert.SerializeObject(dataResponse);
                    _blackstonePosService.LogInfo(controllerName, thread, "Exiting", dataJson);
                }
            }
                
        }

        private string GetRequestId(HttpRequestMessage request)
        {
            try
            {
                var requestIdKey = request.Properties.FirstOrDefault(pair => pair.Key == "MS_RequestId");

                return requestIdKey.Value.ToString();
            }
            catch (Exception exception)
            {
                return string.Empty;
            }
        }

        private object GetDataResponse(HttpActionExecutedContext actionExecutedContext)
        {
            try
            {
                object result = null;

                var response = actionExecutedContext.ActionContext.Response.Content as ObjectContent<DataResponse>;

                if (response != null)
                {
                    result = response.Value;
                    return result;
                }

                var baseResponse = actionExecutedContext.ActionContext.Response.Content as ObjectContent<BaseResponse>;

                if (baseResponse != null)
                {
                    result = baseResponse.Value;
                    return result;
                }

                return null;

            }
            catch (Exception exception)
            {
                return null;
            }
        }
    }
}