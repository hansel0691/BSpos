using System.Web;
using System.Web.Mvc;
using OrdersGateway.Filters;

namespace OrdersGateway
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}