using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Metele.common.Contracts.Services;
using BlackstonePos.Domain.Contracts.Services;
using BlackstonePos.Data.Infrastructure;
using BlackstonePos.Domain.Contracts.Repositories;
using BlackstonePos.Domain.Contracts.Services;
using BlackstonePos.Domain.Models;
using BlackstonePos.Domain.Models.Comparers;
using OrdersGateway.Filters;

namespace OrdersGateway.Controllers
{
    //[ApiExplorerSettings(IgnoreApi = true)]
    public class PromotionsController : ApiController
    {

        private readonly IBlackstonePosService _blackstonePosService;
        private readonly IMeteleService _meteleService; 

        public PromotionsController(IBlackstonePosService blackstonePosService, IMeteleService meteleService)
        {
            _blackstonePosService = blackstonePosService;
            _meteleService = meteleService;
        }

        [HttpPost]
        [ApiResponseDescriptor(typeof(IEnumerable<Promotion>))]
        public DataResponse GetAllPromotions(PosProductRequest productRequest)
        {
            var promotions = _blackstonePosService.GetAllPromotions(productRequest.MerchantId);

            //var temp = promotions.ToList();


            var merchantInfo = _blackstonePosService.FindMerchant(productRequest.MerchantId);

            var productsResponse = _blackstonePosService.GetProducts(productRequest.MerchantId, merchantInfo.MerchantTerminalID.ToString(), merchantInfo.MerchantPassword, merchantInfo.Name);

            var products = (productsResponse.Data as IEnumerable<ProductItem>);


            var r = products.Where(p => p.Name.Contains("CUBACEL")).ToList();

            //var temp = products.FirstOrDefault(p => p.Code == "320485");


            var promotionsProducts = promotions.Join(products, promo => promo.Code, product => product.Code, (a, b) => new Promotion()
            {
                Code = a.Code,
                ImageText = a.ImageText, 
                ImageUrl = a.ImageUrl,
                MainCategory = b.MainCategory 
            }
            ).ToList();


            //var promotionsResult = GetDistinctPromotions(promotionsProducts);
            /*change00*/
            var promotionsResult = promotionsProducts;
            /*change01*/

            return new DataResponse()
            {
                Data = promotionsResult,
                ErrorMessage = promotions != null ? string.Empty : "Could not retrieve Promotions at this moment",
                Status = promotions != null ? 200 : 201
            };
        }

        private IEnumerable<Promotion> GetDistinctPromotions(IEnumerable<Promotion> promotions)
        {
            var promotionsResult = new List<Promotion>();

            foreach(var promo in promotions)
            {
                var existentPromo = promotionsResult.FirstOrDefault(p => p.Code == promo.Code);

                if (existentPromo == null)
                    promotionsResult.Add(promo);
            }

            return promotionsResult;
        }

        
    }
}
