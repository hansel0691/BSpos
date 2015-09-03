using System;
using System.Web.Http;
using System.Web.Http.Description;
using BlackstonePos.Domain.Contracts.Services;
using BlackstonePos.Domain.Models;
using BS.Services.com.blackstoneonline.services;
using Metele.common.Contracts.Services;
using Metele.common.Models;
using Ninject.Extensions.Logging;
using OrdersGateway.Filters;
using Cashier = BlackstonePos.Domain.Models.Cashier;

namespace OrdersGateway.Controllers
{
    //[ApiExplorerSettings(IgnoreApi = true)]
    public class MerchantController : ApiController
    {
        private readonly IMeteleService _meteleService;
        private readonly IBlackstonePosService _blackstonePosService;

        public MerchantController(IMeteleService meteleService, IBlackstonePosService blackstonePosService)
        {
            _meteleService = meteleService;
            _blackstonePosService = blackstonePosService;
        }

        #region Merchant Ops

        [HttpPost, SkipAuthentication]
        [ApiResponseDescriptor(typeof(Cashier))]
        public DataResponse GetMerchantDetails([FromBody]PosRequest merchantRequest)
        {
            
           var cashier = _blackstonePosService.FindCashier(merchantRequest.MerchantId, merchantRequest.MerchantPassword);

           cashier.CustomerService = cashier.IsFullCarga ? " 1 (888) 684-7323" : " 1 (800) 483-2891";

           return new DataResponse
           {
               Data = cashier,
               Status = cashier != null ? 200 : 201,
               ErrorMessage = cashier != null? string.Empty: "Cashier Not Found"
           };

        }

        [HttpPost]
        [ApiResponseDescriptor(typeof(SalesSummary))]
        public DataResponse GetSalesSummary([FromBody] PosRequest merchantRequest)
        {
            var cashier = _blackstonePosService.FindCashier(merchantRequest.MerchantId, merchantRequest.MerchantPassword);

            var salesSummary = GetSalesSummary(cashier);

            return new DataResponse
            {
                Data = salesSummary,
                Status = salesSummary != null? 200: 201,
                ErrorMessage = salesSummary != null? string.Empty: "Could not retrieve Sales Summary"
            };
           
        }

        [HttpPost]
        [ApiResponseDescriptor(typeof(BalanceDetails))]
        public DataResponse GetBalanceDetails([FromBody] PosRequest merchantRequest)
        {
            var balanceDetails = _meteleService.GetMerchantBalanceDetails(merchantRequest.MerchantId.ToString());

            return new DataResponse
            {
                Data = balanceDetails,
                Status = balanceDetails != null ? 200 : 201,
                ErrorMessage = balanceDetails != null ? string.Empty : "Could not retrieve Balance Details"
            };
        }

        private static SalesSummary GetSalesSummary(Cashier cashier)
        {
            var salesSummary = new SalesSummary
            {
                DaylyBalance = cashier.DaylyBalance.Value,
                DailyCreditLimit = cashier.DailyCreditLimit,
                TodaySales = cashier.TodaySales,
                WeeklyBalance = cashier.WeeklyBalance.Value,
                WeeklyCreditLimit = cashier.WeeklyCreditLimit
            };

            return salesSummary;
        }

        private static Cashier GetMerchantDetails(Cashier cashier, GiveCashier cashierGeneralData)
        {
            try
            {
                cashier.MerchantProfileID = cashierGeneralData.catalogTemp_fk;

                cashier.MerchantTerminalID = cashierGeneralData.terminal_id;

                cashier.MerchantPassword = cashierGeneralData.mer_password;

                cashier.IsMerchant = cashier.Password == cashierGeneralData.mer_password;

                return cashier;
            }
            catch (Exception exception)
            {
                return null;
            }
      
        }
 
        #endregion
    }
}
