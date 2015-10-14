using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Web.UI;
using BlackstonePos.Domain.Models;
using OrdersGateway.Models;

namespace OrdersGateway.Filters
{
    public class PageProviderInterceptor: ActionFilterAttribute
    {
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            if (!IsPageProviderInstance(actionExecutedContext))
                return;

            ModifyResponseContent(actionExecutedContext);
        }

        private void ModifyResponseContent(HttpActionExecutedContext actionExecutedContext)
        {
            var dataResponse = (actionExecutedContext.Response.Content as ObjectContent<DataResponse>).Value as DataResponse;

            var pageRequest = actionExecutedContext.ActionContext.ActionArguments.Values.First(arg => arg is PosPageRequest) as PosPageRequest;

            var pageSize = pageRequest.PageSize;
            var pageNumber = pageRequest.PageNumber;

            var data = dataResponse.Data as IEnumerable<dynamic>;

            var dataResult = GetPageFromData(data, pageSize, pageNumber);

            dataResponse.Data = dataResult;

            dataResponse.Count = data.Count();
        }

        private bool IsPageProviderInstance(HttpActionExecutedContext actionExecutedContext)
        {

            return IsPageProviderRequest(actionExecutedContext.ActionContext) &&
                   IsPageProviderResponse(actionExecutedContext.Response);

        }

        private bool IsPageProviderResponse(HttpResponseMessage response)
        {
            try
            {
                var responseIsDataResponse = response.Content.GetType().GetGenericArguments().Any() &&
                                             response.Content.GetType().GetGenericArguments()[0] ==
                                             typeof (DataResponse);
                var dataResponseIsIEnumerable = ((response.Content as ObjectContent<DataResponse>).Value as DataResponse).Data is IEnumerable;

                return responseIsDataResponse && dataResponseIsIEnumerable;

            }
            catch (Exception exception)
            {
                return false;
            }
        }

        private bool IsPageProviderRequest(HttpActionContext actionContext)
        {
            return actionContext.ActionArguments.Values.Any(arg => arg is PosPageRequest);
        }

        private IEnumerable<dynamic> GetPageFromData(IEnumerable<dynamic> data, int pageSize, int pageNumber)
        {
            try
            {
                var count = data.Count();

                //Setting Default Values when at least one the parameters are passed empty(All elements are returned)
                if (pageSize * pageNumber == 0)
                {
                    pageSize = count;
                    pageNumber = 1;
                }

                var list = data.ToList();

                var skipped = pageSize * (pageNumber - 1);

                var dataResult = list.GetRange(skipped, Math.Min(pageSize, count - skipped));

                return dataResult;

            }
            catch (Exception exception)
            {
                return data;
            }
            
        }
    }
}