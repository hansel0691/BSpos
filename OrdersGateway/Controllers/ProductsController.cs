using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Mvc;
using BlackstonePos.Domain.Contracts.Services;
using BlackstonePos.Domain.Models;
using BlackstonePos.Domain.Models.Comparers;
using Metele.common.Models;
using OrdersGateway.com.blackstoneonline.services;
using OrdersGateway.Filters;
using OrdersGateway.Infrastructure;
using Metele.common.Contracts.Services;
using BaseResponse = BlackstonePos.Domain.Models.BaseResponse;
using DataResponse = BlackstonePos.Domain.Models.DataResponse;
using Product = Metele.common.Models.Products.Product;

namespace OrdersGateway.Controllers
{
    //[ApiExplorerSettings(IgnoreApi = true)]
    public class ProductsController : ApiController
    {
        private readonly IMeteleService _meteleService;
        private readonly IBlackstonePosService _blackstonePosService;

        public ProductsController(IMeteleService aService, IBlackstonePosService blackstonePosService)
        {
            _meteleService = aService;
            _blackstonePosService = blackstonePosService;
        }

        #region General Ops

        #region Products
        [System.Web.Http.HttpPost]
        [ApiResponseDescriptor(typeof(ProductRate[]))]
        public DataResponse GetProductRates(PosProductRequest productRequest)
        {
            var merchantInfo = _blackstonePosService.FindMerchant(productRequest.MerchantId);

            var productRates = _blackstonePosService.GetProductRates(productRequest.MerchantId, merchantInfo.MerchantTerminalID.ToString(),
                merchantInfo.MerchantPassword, merchantInfo.Name, productRequest.ProductMainCode);

            return productRates;

        }

        [System.Web.Http.HttpPost]
        [ApiResponseDescriptor(typeof (IEnumerable<string>))]
        public DataResponse GetPosMainProducts(PosCredentials posRequest)
        {
            var mainProducts = _blackstonePosService.GetActiveMainProducts(posRequest.MerchantId);

            return mainProducts;
        }

        [System.Web.Http.HttpPost]
        [ApiResponseDescriptor(typeof(ProductAccessPhone[]))]
        public DataResponse GetProductAccessNumbers(PosProductRequest productRequest)
        {
            var merchantInfo = _blackstonePosService.FindMerchant(productRequest.MerchantId);

            var productRates = _blackstonePosService.GetProductAccessNumbers(productRequest.MerchantId, merchantInfo.MerchantTerminalID.ToString(),
                merchantInfo.MerchantPassword, merchantInfo.Name, productRequest.ProductMainCode);
            return productRates;

        }

        [System.Web.Http.HttpPost]
        [ApiResponseDescriptor(typeof(ProductItem))]
        public DataResponse GetProduct(PosProductRequest productRequest)
        {
            var merchantInfo = _blackstonePosService.FindMerchant(productRequest.MerchantId);

            var productResponse = _blackstonePosService.GetProduct(productRequest.MerchantId, merchantInfo.MerchantTerminalID.ToString(), merchantInfo.MerchantPassword, 
                                                                   merchantInfo.Name, productRequest.ProductMainCode);

            return productResponse;
        }

        [System.Web.Http.HttpPost]
        [ApiResponseDescriptor(typeof(double[]))]
        public DataResponse GetProductDenominations(PosProductRequest productRequest)
        {
            var merchantInfo = _blackstonePosService.FindMerchant(productRequest.MerchantId);

            var productResponse = _blackstonePosService.GetProductDenominations(productRequest.MerchantId.ToString(), merchantInfo.MerchantTerminalID.ToString(),
                merchantInfo.MerchantPassword, merchantInfo.Name, productRequest.ProductMainCode);

            return productResponse;
        }

        [System.Web.Http.HttpPost]
        [ApiResponseDescriptor(typeof(IEnumerable<ProductItem>))]
        public DataResponse GetAllProducts(PosProductRequest productRequest)
        {
            var cashierInfo = _blackstonePosService.FindMerchant(productRequest.MerchantId);

            const int mostPopularAmount = 150;

            var productsResponse = _blackstonePosService.GetProducts(productRequest.MerchantId, cashierInfo.MerchantTerminalID.Value.ToString(), cashierInfo.MerchantPassword, cashierInfo.Name, productRequest.Category, mostPopularAmount);

            return productsResponse;
        }

        [System.Web.Http.HttpPost]
        [ApiResponseDescriptor(typeof(IEnumerable<Initial>))]
        public DataResponse GetProductInitialsByCategory(PosProductRequest productRequest)
        {
            var allProductsDataResponse = GetAllProducts(productRequest);

            var allProductsInitials = (allProductsDataResponse.Data as IEnumerable<ProductItem>).Select(p=> p.Name.Substring(0,1)).GetInitials().Distinct(new InitialComparer());

            return new DataResponse
            {
                Data = allProductsInitials,
                ErrorMessage = allProductsInitials!= null? string.Empty: "Could not retrieve product initials.",
                Status = allProductsInitials!= null? 200: 201
            };
        }

        [System.Web.Http.HttpPost]
        [ApiResponseDescriptor(typeof(IEnumerable<ProductItem>))]
        public DataResponse GetMostSoldProducts(PosProductRequest productRequest)
        {
            var cashierInfo = _blackstonePosService.FindMerchant(productRequest.MerchantId);

            var mostSoldProductsResponse = _blackstonePosService.GetMostSoldProducts(productRequest.MerchantId, cashierInfo.MerchantTerminalID.ToString(), cashierInfo.MerchantPassword, cashierInfo.Name, productRequest.Category, productRequest.Amount);

            return mostSoldProductsResponse;

        }

        [System.Web.Http.HttpPost]
        [ApiResponseDescriptor(typeof(IEnumerable<ProductItem>))]
        public DataResponse GetProductsByCategoryByCountry(PosProductRequest productRequest)
        {
            IEnumerable<ProductItem> products;
            switch (productRequest.Category)
            {
                case "international":
                {
                    products = getWirelessProductsByCountry(productRequest);
                    break;
                }
                case "longdistance":
                {
                    products = getLongDistanceProductsByCountry(productRequest);
                    break;
                }
                default:
                {
                    products = null;
                    break;
                }
            }

            return new DataResponse
            {
                Data = products, 
                ErrorMessage = products!=null?string.Empty:"Could not retrieve products at this time", 
                Status= products!= null? 200: 201
            };
        }

        [System.Web.Http.HttpPost]
        [ApiResponseDescriptor(typeof(IEnumerable<ProductItem>))]
        public DataResponse GetProductInitialsByCategoryByCountry(PosProductRequest productRequest)
        {
            var productsByCategoryByCountryResponse = GetProductsByCategoryByCountry(productRequest);

            var productsByCategoryByCountry = productsByCategoryByCountryResponse.Data as IEnumerable<ProductItem>;

            var initials = productsByCategoryByCountry.Select(p => p.Name.Substring(0, 1)).GetInitials();

            return new DataResponse
            {
                Data = initials,
                ErrorMessage = initials != null ? string.Empty : "Could not retrieve product initials at this time",
                Status = initials != null ? 200 : 201
            };
        }
        #endregion

        #region Wireless
        [System.Web.Http.HttpPost]
        [ApiResponseDescriptor(typeof(IEnumerable<Carrier>))]
        public DataResponse GetWirelessCarriers(PosProductRequest productRequest)
        {

            var carriers = !string.IsNullOrEmpty(productRequest.CountryCode) ?
                _meteleService.GetWirelessCarriers(productRequest.CountryCode, productRequest.MerchantId) :
                GetWirelessCarriers(productRequest.MerchantId);

            var carriersResult = carriers.Select(c => new
            {
                ImageUrl = string.Format("http://mobile.blackstonepos.com/products/IMG_{0}.jpg", c.ImageName),
                Name = c.CarrierName,
                Id = c.CarrierId,
                c.PhoneCode
            });

            return new DataResponse
            {
                Data = carriersResult,
                ErrorMessage = carriers != null ? string.Empty : "Could not retrieve Wireless Carriers",
                Status = carriers != null ? 200 : 201
            };

        }

        [System.Web.Http.HttpPost]
        [ApiResponseDescriptor(typeof(IEnumerable<Initial>))]
        public DataResponse GetWirelessCarrierInitials(PosProductRequest productRequest)
        {
            var carriers = !string.IsNullOrEmpty(productRequest.CountryCode) ? _meteleService.GetWirelessCarriers(productRequest.CountryCode, productRequest.MerchantId) 
                : GetWirelessCarriers(productRequest.MerchantId);

            var initials = carriers.Select(carrier => carrier.CarrierName.Substring(0, 1)).GetInitials();

            return new DataResponse
            {
                Data = initials,
                ErrorMessage = carriers != null ? string.Empty : "Could not retrieve Wireless Carrier Initials",
                Status = carriers != null ? 200 : 201
            };
        }

        [System.Web.Http.HttpPost]
        [ApiResponseDescriptor(typeof(IEnumerable<Country>))]
        public DataResponse GetWirelessCountries(PosProductRequest productRequest)
        {
            var countriesResult = getWirelessCountries(productRequest.MerchantId);

            return new DataResponse
            {
                Data = countriesResult,
                Status = countriesResult != null ? 200 : 201,
                ErrorMessage = countriesResult != null ? string.Empty :
                "Could not retrieve Wireless countries at this time."
            };
        }


        [System.Web.Http.HttpPost]
        [ApiResponseDescriptor(typeof(Carrier))]
        public DataResponse GetWirelessCarrierDetails(PosProductRequest productRequest)
        {
            var carriers = GetWirelessCarriers(productRequest.MerchantId);

            var carriersResult = carriers.Select(c => new
            {
                ImageUrl = c.ImageName,
                Name = c.CarrierName,
                Id = c.CarrierId,
                c.PhoneCode
            }).FirstOrDefault(a=> a.Id == productRequest.CarrierId);

            return new DataResponse
            {
                Data = carriersResult,
                ErrorMessage = carriersResult != null ? string.Empty : "Could not retrieve Wireless Carrier Details",
                Status = carriersResult != null ? 200 : 201
            };
         
        }

        [System.Web.Http.HttpPost]
        [ApiResponseDescriptor(typeof(IEnumerable<ProductItem>))]
        public DataResponse GetWirelessProductsByCountry(PosProductRequest productRequest)
        {
            var longDistanceProducts = getWirelessProductsByCountry(productRequest).ToList();

            //Cable to help building the url in the client
            longDistanceProducts.ForEach(p => p.MainCategory = "wireless");

            return new DataResponse
            {
                Data = longDistanceProducts,
                Status = longDistanceProducts != null ? 200 : 201,
                ErrorMessage = longDistanceProducts != null ? string.Empty :
                "Could not retrieve Wireless products at this time."
            };
        }

        [System.Web.Http.HttpPost]
        [ApiResponseDescriptor(typeof(IEnumerable<ProductItem>))]
        public DataResponse GetWirelessProductsByCarrier(PosProductRequest productRequest)
        {
            var wirelessProdsByCarrier = getWirelessProductsByCarrier(productRequest).ToList();

            //Cable to help building the url in the client
            wirelessProdsByCarrier.ForEach(p => p.MainCategory = "wireless");

            return new DataResponse
            {
                Data = wirelessProdsByCarrier,
                Status = wirelessProdsByCarrier != null ? 200 : 201,
                ErrorMessage = wirelessProdsByCarrier != null ? string.Empty :
                "Could not retrieve Wireless Products at this time."
            };
        }

        #endregion

        #region Countries Ops 
       
        //Not in use
        [System.Web.Http.HttpPost]
        public DataResponse GetLongDistanceCountries(PosProductRequest productRequest)
        {
            var countriesResult = getLongDistanceCountries(productRequest.MerchantId);

            return new DataResponse
            {
                Data = countriesResult,
                Status = countriesResult != null ? 200 : 201,
                ErrorMessage = countriesResult != null ? string.Empty :
                "Could not retrieve Long Distance countries at this time."
            };
        }

        //Not in use
        [System.Web.Http.HttpPost]
        public DataResponse GetLongDistanceCountryInitials(PosProductRequest productRequest)
        {
            var longDistanceCountries = _meteleService.GiveCountries(productRequest.MerchantId);

            var initials = longDistanceCountries.Select(country => country.CountryName.Substring(0, 1)).GetInitials();

            return new DataResponse
            {
                Data = initials,
                Status = longDistanceCountries != null ? 200 : 201,
                ErrorMessage = longDistanceCountries != null ? string.Empty :
                "Could not retrieve Long Distance countries at this time."
            };
        }

        //Not in use
        [System.Web.Http.HttpPost]
        public DataResponse GetLongDistanceProductsByCountry(PosProductRequest productRequest)
        {
            var longDistanceProducts = getLongDistanceProductsByCountry(productRequest).ToList();

            //Cable to help building the url in the client
            longDistanceProducts.ForEach(p => p.MainCategory = "longdistance");

            return new DataResponse
            {
                Data = longDistanceProducts,
                Status = longDistanceProducts != null ? 200 : 201,
                ErrorMessage = longDistanceProducts != null ? string.Empty :
                "Could not retrieve Long Distance products at this time."
            };
        }
        #endregion

        #region By Categories

        [System.Web.Http.HttpPost]
        [ApiResponseDescriptor(typeof(IEnumerable<Country>))]
        public DataResponse GetCountriesByCategory(PosProductRequest productRequest)
        {
            var countriesByCategory = getCountriesByCategory(productRequest.MerchantId, productRequest.Category);

            return new DataResponse
            {
                Data = countriesByCategory, 
                ErrorMessage = countriesByCategory != null? string.Empty: "Could not retrieve countries at this time",
                Status = countriesByCategory != null ? 200: 201
            };
        }

        [System.Web.Http.HttpPost]
        [ApiResponseDescriptor(typeof(IEnumerable<Initial>))]
        public DataResponse GetCountryInitialsByCategory(PosProductRequest productRequest)
        {
            var countriesByCategory = getCountriesByCategory(productRequest.MerchantId, productRequest.Category);

            var countriesInitials = countriesByCategory.Select(c => c.Name.Substring(0,1)).GetInitials();

            return new DataResponse
            {
                Data = countriesInitials,
                ErrorMessage = countriesInitials != null ? string.Empty : "Could not retrieve countries initials at this time",
                Status = countriesInitials != null ? 200 : 201
            };

        }

        [System.Web.Http.HttpPost]
        [ApiResponseDescriptor(typeof(Country))]
        public DataResponse GetCountryDetailsByCategory(PosProductRequest productRequest)
        {
            var country = getCountryDetailsByCategory(productRequest.MerchantId, productRequest.Category, productRequest.CountryCode);

            return new DataResponse
            {
                Data = country,
                Status = country != null ? 200 : 201,
                ErrorMessage = country != null ? string.Empty :
                "Could not retrieve Long Distance country details at this time."
            };   
        }
        #endregion

        #endregion

        #region Product Buying Ops

        [System.Web.Http.HttpPost]
        [ApiResponseDescriptor(typeof(ReceiptResponse))]
        public DataResponse DoBlackstonePosOperation([FromBody] PosRequest posRequest)
        {
            posRequest.OriginRequest = Request.RequestUri.AbsoluteUri;

            var productInfo = GetProductInfo(posRequest);

            //Completing request information depending on Product Main Code
            posRequest.ProductName = productInfo.Name;

            posRequest.CountryCode = productInfo.DialCountryCode;

            var posResponse = productInfo.IsTopUp?_blackstonePosService.DoTopUp(posRequest): _blackstonePosService.GetSinglePin(posRequest);

            return new DataResponse
            {
                Data = posResponse.Data,
                ErrorMessage = posResponse.ErrorMessage,
                Status = posResponse.Status
            };
        }

        #endregion

        #region Aux Ops

        private ProductItem GetProductInfo(PosRequest posRequest)
        {
            var merchantInfo = _blackstonePosService.FindMerchant(posRequest.MerchantId);

            var product = _blackstonePosService.GetProduct(posRequest.MerchantId, merchantInfo.MerchantTerminalID.ToString(),
                merchantInfo.MerchantPassword, merchantInfo.Name, posRequest.ProductMainCode);

            var productInfo = product.Data as ProductItem;

            return productInfo;
        }
        private IEnumerable<ProductItem> getLongDistanceProductsByCountry(PosProductRequest productRequest)
        {
            var countryName = GetLongDistanceCountryName(productRequest.MerchantId, productRequest.CountryCode);

            var longDistanceProducts = _meteleService.GetLongDistanceProductsByCountry(productRequest.MerchantId, countryName);

            var merchantInfo = _blackstonePosService.FindMerchant(productRequest.MerchantId);

            var productsFromService = _blackstonePosService.GetProducts(merchantInfo.MerchantId, merchantInfo.MerchantTerminalID.ToString(),
                merchantInfo.MerchantPassword, merchantInfo.Name).Data as IEnumerable<ProductItem>;

            var productsJoined = productsFromService.Join(longDistanceProducts, a => a.Code, b => b.ProductMainCode, (a, b) => a).ToList();

            var productsResult = productsJoined.Distinct(new ProductItemComparer());

            return productsResult;
        }

        private IEnumerable<ProductItem> getWirelessProductsByCountry(PosProductRequest productRequest)
        {
            var wirelessPlans = GetAllWirelessPlansByCountry(productRequest.MerchantId, productRequest.CountryCode);

            var merchantInfo = _blackstonePosService.FindMerchant(productRequest.MerchantId);

            var productsFromService = _blackstonePosService.GetProducts(merchantInfo.MerchantId, merchantInfo.MerchantTerminalID.ToString(),
                merchantInfo.MerchantPassword, merchantInfo.Name).Data as IEnumerable<ProductItem>;

            var productsJoined = productsFromService.Join(wirelessPlans, a => a.Code, b => b.PlanId, (a, b) => a);

            return productsJoined;
        }

        private IEnumerable<WirelessPlans> GetAllWirelessPlansByCountry(int merchantId, string countryCode)
        {
            var wirelessCarriers = _meteleService.GetWirelessCarriers(countryCode, merchantId);

            var wirelessPlans = new List<WirelessPlans>();

            foreach (var wirelessCarrier in wirelessCarriers)
            {
                var wirelessPlansByCarrier = _meteleService.GetWirelessPlans(wirelessCarrier.CarrierId.ToString(), countryCode,
                    merchantId);

                wirelessPlans.AddRange(wirelessPlansByCarrier);
            }
            return wirelessPlans;
        }

        private IEnumerable<ProductItem> getWirelessProductsByCarrier(PosProductRequest productRequest)
        {
            var wirelessProducts = _meteleService.GetWirelessPlans(productRequest.CarrierId.ToString(), "USA", productRequest.MerchantId);

            var merchantInfo = _blackstonePosService.FindMerchant(productRequest.MerchantId);

            var productsFromService = _blackstonePosService.GetProducts(productRequest.MerchantId, merchantInfo.MerchantTerminalID.ToString(), merchantInfo.MerchantPassword, merchantInfo.Name).Data as IEnumerable<ProductItem>;

            var productsJoined = productsFromService.Join(wirelessProducts, a => a.Code, b => b.PlanId, (a, b) => a).ToList();

            var productsResult = productsJoined.Distinct(new ProductItemComparer());

            return productsResult;
        }

        private IEnumerable<Carrier> GetWirelessCarriers(int merchantId)
        {
            //var result = _meteleService.GetWirelessCarriers(merchantId);

            var wirelessCountries = _meteleService.GetWirelessCountries(merchantId);

            var allCarriers = new List<Carrier>();

            foreach (var country in wirelessCountries)
            {
                var carriersByCountry = _meteleService.GetWirelessCarriers(country.CountryCode, merchantId).ToList();

                allCarriers.AddRange(carriersByCountry);
            }

            var carriersResult = allCarriers.Distinct(new CarrierComparer());

            return carriersResult;
        }

        private IEnumerable<Country> getCountriesByCategory(int merchantId, string category)
        {
            IEnumerable<Country> result;

            switch (category)
            {
                case "longdistance":
                {
                    result = GetLongDistanceCountries(merchantId);
                    break;
                }
                case "international":
                {
                    result = _meteleService.GetWirelessCountries(merchantId).Where(c=> c.CountryCode!="USA").Select(c => new Country
                    {
                        Name = c.CountryName,
                        CountryCode = c.CountryCode,
                        ShortCountryCode = c.ShortCountryCode
                    });
                    break;
                }
                default:
                {
                    result = null;
                    break;
                }
            }

            return result;
        }

        private Country getCountryDetailsByCategory(int merchantId, string category, string countryCode)
        {
            var allCountriesByCategory = getCountriesByCategory(merchantId, category);

            var country = allCountriesByCategory.FirstOrDefault(c => c.CountryCode == countryCode);

            return country;
        }

        private IEnumerable<Country> getWirelessCountries(int merchantId)
        {
            var wirelessCountries = _meteleService.GetWirelessCountries(merchantId);

            var countriesResult = wirelessCountries.Select(c => new Country
            {
                Name = c.CountryName,
                CountryCode = c.CountryCode,
                ShortCountryCode = c.ShortCountryCode
            });

            return countriesResult;
        }

        private IEnumerable<Country> getLongDistanceCountries(int merchantId)
        {
            var longDistanceCountries = _meteleService.GiveCountries(merchantId);

            var countriesResult = longDistanceCountries.Select(c => new Country()
            {
                Name = c.CountryName,
                CountryCode = c.CountryCode,
                ShortCountryCode = c.ShortCountryCode
            });

            return countriesResult;

        }

        private string GetLongDistanceCountryName(int merchantId, string countryCode)
        {
            var countries = getLongDistanceCountries(merchantId);

            var country = countries.FirstOrDefault(c => c.CountryCode == countryCode);

            return country != null ? country.Name : string.Empty;
        }

        private IEnumerable<Country> GetLongDistanceCountries(int merchantId)
        {
            var longCountries = _meteleService.GiveCountries(merchantId);

            var wirelessCountries = _meteleService.GetWirelessCountries(merchantId);

            var enhacedCountries = longCountries.Join(wirelessCountries, a => a.ShortCountryCode,
                b => b.ShortCountryCode, (a, b) => new Country
                {
                    Name = a.CountryName,
                    CountryCode = b.CountryCode,
                    ShortCountryCode = a.ShortCountryCode
                });
            
            return enhacedCountries;
        }

        #endregion

        #region test

        [System.Web.Http.HttpPost]
        public DataResponse GetFullcargaAccessNumber(PosProductRequest posRequest)
        {
            var accessNumber = _blackstonePosService.FullcargaAccessNumberTest(posRequest.MerchantId,
                posRequest.ProductMainCode);

            return new DataResponse
            {
                Data = accessNumber,
                Status = 200,
                ErrorMessage = "OK"
            };
        }

        #endregion

    }
}
