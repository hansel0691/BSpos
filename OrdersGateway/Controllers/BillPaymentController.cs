using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using AutoMapper;
using BlackstonePos.Data.Infrastructure;
using BlackstonePos.Data.Repositories;
using BlackstonePos.Domain.Contracts.Repositories;
using BlackstonePos.Domain.Contracts.Services;
using BlackstonePos.Domain.Models;
using BS.Services.com.blackstoneonline.services;
using BS.Services.Contracts_Implementation;
using BS.Services.Infrastructure;
using Metele.common.Contracts.Services;
using Metele.common.Models;
using Metele.common.Models.Products.BillPayment;
using Metele.data;
using Metele.data.Helpers;
using Metele.services;
using Metele.utils.general;
using OrdersGateway.Filters;
using OrdersGateway.Infrastructure;
using OrdersGateway.Models;
using Cashier = BlackstonePos.Domain.Models.Cashier;
using MasterBiller = Metele.common.Models.Products.BillPayment.MasterBiller;
using BillPayment = Metele.common.Models.Products.BillPayment.BillPaymentResponse;

namespace OrdersGateway.Controllers
{
    [SkipAuthentication]
    //[ApiExplorerSettings(IgnoreApi = true)]
    public class BillPaymentController : ApiController
    {
        private readonly IBlackstonePosService _blackstonePosService;
        private readonly IMeteleService _meteleService;

        public BillPaymentController(IBlackstonePosService blackstonePosService, IMeteleService meteleService)
        {
            _blackstonePosService = blackstonePosService;
            _meteleService = meteleService;
        }

        [HttpPost]
        [ApiResponseDescriptor(typeof(List<BillPaymentCategory>))]
        public DataResponse GetBillPaymentCategories(PosBillPaymentRequest posBillPaymentRequest)
        {
            var cashier = _blackstonePosService.FindMerchant(posBillPaymentRequest.MerchantId);

            var cashierInfo = cashier.UIMapTo<Cashier, GiveCashier>();

            var categories = _meteleService.GetBillPaymentCategoriesPos(cashierInfo);

            return new DataResponse
            {
                Data = categories, 
                ErrorMessage = categories != null? string.Empty:"Could not retrieve categories",
                Status = categories != null? 200 : 201
            };
        }

        [HttpPost]
        [ApiResponseDescriptor(typeof(List<PosMasterBiller>))]
        public DataResponse GetBillersByCategory(PosBillPaymentRequest posBillPaymentRequest)
        {
            var cashier = _blackstonePosService.FindMerchant(posBillPaymentRequest.MerchantId);

            var cashierInfo = cashier.UIMapTo<Cashier, GiveCashier>();

            //Retrieves all master billers when the category is not suministrated
            var billersByCategory = string.IsNullOrEmpty(posBillPaymentRequest.CategoryId)? GetAllMasterBillers(cashierInfo)
                                    : GetMasterBillersByCategories(cashierInfo, posBillPaymentRequest.CategoryId);

            return new DataResponse
            {
                Data = billersByCategory,
                ErrorMessage = billersByCategory != null ? string.Empty : "Could not retrieve Billers",
                Status = billersByCategory != null ? 200 : 201
            };

        }

        [HttpPost]
        [ApiResponseDescriptor(typeof(List<Initial>))]
        public DataResponse GetBillersInitials(PosBillPaymentRequest posBillPaymentRequest)
        {
            var cashier = _blackstonePosService.FindMerchant(posBillPaymentRequest.MerchantId);

            var cashierInfo = MapperHelper.UIMapTo<Cashier, GiveCashier>(cashier);

            //Retrieves all master billers when the category is not suministrated
            var billersByCategory = string.IsNullOrEmpty(posBillPaymentRequest.CategoryId) ? GetAllMasterBillers(cashierInfo)
                                    : GetMasterBillersByCategories(cashierInfo, posBillPaymentRequest.CategoryId);
            
            var initials = billersByCategory.Select(a => a.Id.Substring(0,1)).GetInitials();

            return new DataResponse
            {
                Data = initials,
                ErrorMessage = billersByCategory != null ? string.Empty : "Could not retrieve Billers",
                Status = billersByCategory != null ? 200 : 201
            };

        }

        [HttpPost]
        [ApiResponseDescriptor(typeof(PosMasterBiller))]
        public DataResponse GetMasterBiller(PosBillPaymentRequest posBillPaymentRequest)
        {
            var cashier = _blackstonePosService.FindMerchant(posBillPaymentRequest.MerchantId);

            var cashierInfo = cashier.UIMapTo<Cashier, GiveCashier>();

            var masterBiller = _meteleService.GetMasterBillerOptionsPos(cashierInfo, posBillPaymentRequest.BillerId);

            var posMasterBiller = masterBiller.UIMapTo<MasterBiller, PosMasterBiller>();

            return new DataResponse
            {
                Data = posMasterBiller,
                ErrorMessage = masterBiller != null ? string.Empty : "Could not retrieve Biller Details",
                Status = masterBiller != null ? 200: 201
            };

        }

        [HttpPost]
        [ApiResponseDescriptor(typeof(List<BillerPaymentOption>))]
        public DataResponse GetBillerPaymentOptions(PosBillPaymentRequest posBillPaymentRequest)
        {
            var cashier = _blackstonePosService.FindMerchant(posBillPaymentRequest.MerchantId);

            var cashierInfo = cashier.UIMapTo<Cashier, GiveCashier>();

            var billerPaymentOptions = _meteleService.GetBillerPaymentOptionsPos(cashierInfo, posBillPaymentRequest.BillerId);

            var billerSettings = _meteleService.GetMasterBillerOptionsPos(cashierInfo, posBillPaymentRequest.BillerId);

            if(billerSettings == null)
                return new DataResponse
                {
                    ErrorMessage = "Could not retrieve Biller Payment Options",
                    Status = 201
                };

            if (billerSettings.PostingTime.HasPassedCutOff())
                SetNextPaymentDay(billerPaymentOptions);
            
            return new DataResponse
            {
                Data = billerPaymentOptions,
                ErrorMessage = billerPaymentOptions != null ? string.Empty : "Could not retrieve Biller Payment Options",
                Status = billerPaymentOptions != null ? 200 : 201
            };
        }

        [HttpPost]
        [ApiResponseDescriptor(typeof(MasterBiller))]
        public DataResponse DoBillPaymentNextStep(PosBillPaymentRequest posBillPaymentRequest)
        {
            var doBillPaymentNextStep = _blackstonePosService.DoBillPaymentNextStep(posBillPaymentRequest);

            return doBillPaymentNextStep;
        }

        [HttpPost]
        [ApiResponseDescriptor(typeof(ReceiptResponse))]
        public DataResponse DoBillPayment(PosBillPaymentRequest posBillPaymentRequest)
        {
            var doBillPaymentResponse = _blackstonePosService.DoBillPayment(posBillPaymentRequest);

            return doBillPaymentResponse;
        }

        #region Aux Functions
       
        private static void SetNextPaymentDay(IEnumerable<BillerPaymentOption> paymentOptions)
        {
            foreach (var paymentOption in paymentOptions)
                paymentOption.PaymentDescription = paymentOption.PaymentDescriptionAfterCutOff;
        }

        private  IEnumerable<PosMasterBiller> GetMasterBillersByCategories(GiveCashier cashierInfo, params string[] categoryIds)
        {
            var masterBillersResult = new List<PosMasterBiller>();

            foreach (var billPaymentCategoryId in categoryIds)
            {
                var masterBillersByCategory = _meteleService.GetBillersByCategoryPos(cashierInfo, billPaymentCategoryId).ToList();
                var posMasterBillers = masterBillersByCategory.UIMapTo<IEnumerable<MasterBiller>, IEnumerable<PosMasterBiller>>().ToList();

                posMasterBillers.ForEach(biller =>
                {
                    biller.PaymentOptions = _meteleService.GetBillerPaymentOptionsPos(cashierInfo, biller.Name);
                    biller.CategoryId = billPaymentCategoryId;
                });
                masterBillersResult.AddRange(posMasterBillers);
            }

            return masterBillersResult;
        }


        private IEnumerable<PosMasterBiller> GetAllMasterBillers(GiveCashier cashierInfo)
        {
            var allCategories = _meteleService.GetBillPaymentCategoriesPos(cashierInfo).Select(cat => cat.Id);

            return GetMasterBillersByCategories(cashierInfo, allCategories.ToArray());
        }

        #endregion

    }
}
