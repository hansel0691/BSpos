using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BlackstonePos.Domain.Models;
using BlackstonePos.Domain.Contracts.Services;

namespace OrdersGateway.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {

            return View();
        }

    }
}
