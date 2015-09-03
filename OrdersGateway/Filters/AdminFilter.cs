using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using BlackstonePos.Domain.Contracts.Services;
using BlackstonePos.Domain.Exceptions;
using BlackstonePos.Domain.Models;
using BS.Services.Contracts_Implementation;
using Metele.common.Contracts.Services;
using Metele.services;

namespace OrdersGateway.Filters
{
    public class AdminFilter: ActionFilterAttribute
    {
        private readonly IBlackstonePosService _blackstonePosService;

        public AdminFilter()
        {
            var dependencyResolver = new MyDependencyResolver();

            _blackstonePosService = (BlackstonePosService)dependencyResolver.GetService(typeof (IBlackstonePosService));
        }

        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            var isPreAuthorized = actionContext.ActionDescriptor.ControllerDescriptor.GetCustomAttributes<SkipAuthentication>().Any() ||
                                  actionContext.ActionDescriptor.GetCustomAttributes<SkipAuthentication>().Any();

            if (isPreAuthorized)
                return;

            var controllerName = actionContext.ControllerContext.ControllerDescriptor.ControllerName;

            var actionName = actionContext.ActionDescriptor.ActionName;

            var parameters = actionContext.ActionArguments;

            var basePosRequestArg = parameters.Values.FirstOrDefault(arg => arg is PosCredentials);

            if(!IsMerchantAuthorized(basePosRequestArg))
                actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized, 
                    new DataResponse(new UnAuthorizedException(), controllerName, actionName));

        }

        private bool IsMerchantAuthorized(object posRequestParam)
        {
            if (posRequestParam == null)
                return false;

            var arg = posRequestParam as PosCredentials;

            var merchantInfo = _blackstonePosService.FindCashier(arg.MerchantId, arg.MerchantPassword);

            return merchantInfo != null && merchantInfo.IsMerchant.HasValue && merchantInfo.IsMerchant.Value;

        }
    }
}