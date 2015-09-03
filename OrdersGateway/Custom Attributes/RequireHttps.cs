using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace OrdersGateway.Controllers
{
    class RequireHttpsAttribute : AuthorizationFilterAttribute
    {
        public override void OnAuthorization(HttpActionContext actionContext)
        {
#if !DEBUG
            if (actionContext == null)
            {
                throw new ArgumentNullException("actionContext");
            }

            if (actionContext.Request.RequestUri.Scheme != Uri.UriSchemeHttps)
            {
                actionContext.Response = new HttpResponseMessage(System.Net.HttpStatusCode.Forbidden);
                actionContext.Response.ReasonPhrase = "SSL Required";
            }
            else
            {
                base.OnAuthorization(actionContext);
            }
#else
            base.OnAuthorization(actionContext);
#endif
        }
    }
}
