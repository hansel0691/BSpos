using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using BlackstonePos.Domain.Contracts.Services;
using BlackstonePos.Domain.Models;
using BS.Services.Contracts_Implementation;
using Metele.common.Models;
using Metele.common.Models.Products.BillPayment;
using Metele.common.Models.Products.DirectTv;
using OrdersGateway.Filters;
using OrdersGateway.Infrastructure;
using OrdersGateway.Models;
using Cashier = BlackstonePos.Domain.Models.Cashier;

namespace OrdersGateway.Controllers
{
    //[ApiExplorerSettings(IgnoreApi = true)]
    public class DirectTvController : ApiController
    {
        private readonly IBlackstonePosService _blackstonePosService;

        public DirectTvController(IBlackstonePosService blackstonePosService)
        {
            _blackstonePosService = blackstonePosService;
        }

        [HttpPost]
        [ApiResponseDescriptor(typeof(List<DirectTvCategory>))]
        public DataResponse GetDirectTvCategories(PosRequest request)
        {
            var directTvCategories = _blackstonePosService.GetDirectTvCategories();

            return directTvCategories;
        }

        [HttpPost]
        [ApiResponseDescriptor(typeof(List<DirectTvProduct>))]
        public DataResponse GetDirectTvProductsByCategory(PosCategoryRequest request)
        {
            var directTvProducts = _blackstonePosService.GetDirectTvProductsByCategory(request.Category);

            return directTvProducts;
        }


        [HttpPost]
        [ApiResponseDescriptor(typeof(DirectTvProduct))]
        public DataResponse GetDirectTvProduct(PosRequest request)
        {
            var directTvProducts = _blackstonePosService.GetDirectTvProduct(int.Parse(request.ProductMainCode));

            return directTvProducts;
        }

        [HttpPost]
        [ApiResponseDescriptor(typeof(List<DirectTvProduct>))]
        public DataResponse GetDirectTvAllProducts(PosRequest request)
        {
            var directTvProducts = _blackstonePosService.GetDirectTvAllProducts();

            return directTvProducts;
        }

    }
}
