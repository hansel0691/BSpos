using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using BlackstonePos.Data.EFModels;
using BlackstonePos.Domain.Contracts.Repositories;

namespace BlackstonePos.Data.Repositories
{
    public class BsPromotionsRepository : IPromotionsRepository
    {
        private readonly BlackstonePos_NewEntities _dbContext;
         public BsPromotionsRepository()
            {
                _dbContext = new BlackstonePos_NewEntities();

            }

          public IEnumerable<Domain.Models.Promotion> GetAllPromotions()
          {
              var promotions = _dbContext.getPromotios();

              var promotionsProyection = promotions.Select(p => new Domain.Models.Promotion()
              {
                  Code = p.Code,
                  ImageUrl = string.Format("http://mobile.meteleusa.com/products/{0}", p.ImageUrl),
                  ImageText = p.SmallImageText
              }
              );

              var promotionsResult = promotionsProyection.Where(p => UrlExists(p.ImageUrl));

              return promotionsResult;
          }

        public IEnumerable<string> GetActivePosProducts(int merchantId)
        {
            var allMainProducts = _dbContext.pos_mainproducts;

            var merchantProducts = new SortedSet<string>(allMainProducts.Where(p => p.merchant_pk == merchantId && p.prdActive == 1)
                .Select(p=> p.prdDescription));

            var extraPosMainProducts = new SortedSet<string>
            {
                "longdistance"
            };

            merchantProducts.UnionWith(extraPosMainProducts);

            return merchantProducts;
        }


        private List<string> GetPosMainProductsUniverse()
        {
            return new List<string>
            {
                
            };
        }

        /// Created By:Carlos Garcia
          /// <summary>
          /// 
          /// </summary>
          /// <returns></returns>
          /// 
          private bool UrlExists(string url)
          {
              try
              {

                  var uriCheck = new Uri(url);

                  var req = (HttpWebRequest)WebRequest.Create(uriCheck);

                  var response = (HttpWebResponse)req.GetResponse();

                  return response.StatusCode == HttpStatusCode.OK;
              }
              catch (Exception ex)
              {
                  return false;
              }
          }
    }
}
