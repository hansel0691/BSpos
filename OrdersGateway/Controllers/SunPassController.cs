using System.Web.Http;
using System.Web.Http.Description;
using BlackstonePos.Domain.Contracts.Services;
using BlackstonePos.Domain.Models;
using BS.Services.com.blackstoneonline.services;
using Metele.services;
using OrdersGateway.Filters;

namespace OrdersGateway.Controllers
{
    //[ApiExplorerSettings(IgnoreApi = true)]
    public class SunPassController : ApiController
    {
        private readonly IBlackstonePosService _blackstonePosService;

        public SunPassController(IBlackstonePosService blackstonePosService )
        {
            _blackstonePosService = blackstonePosService;
        }

        #region Transporder Ops
        [HttpPost]
        [ApiResponseDescriptor(typeof(BalanceResponse))]
        public DataResponse GetSunpassTransporderInfo(SunpassBalanceInfoRequest request)
        {
            var sunpassDocumentsInfoResponse = _blackstonePosService.GetSunpassTransporderInfo(request);

            return sunpassDocumentsInfoResponse;
        }

        [HttpPost]
        [ApiResponseDescriptor(typeof(ReceiptResponse))]
        public DataResponse DoSunpassReplenishment(SunpassReplenishmentRequest request)
        {
            var sunpassReplenishmentResponse = _blackstonePosService.DoSunpassReplenishment(request);

            return sunpassReplenishmentResponse;
        }
        #endregion

        #region Documents Ops
        [HttpPost]
        [ApiResponseDescriptor(typeof(DocumentInquiryResponse))]
        public DataResponse GetSunpassDocumentsInfo(DocumentsInquiryRequest request)
        {
            var sunpassDocumentsInfoResponse = _blackstonePosService.GetSunpassDocumentsInfo(request);

            return sunpassDocumentsInfoResponse;

        }

        [HttpPost]
        [ApiResponseDescriptor(typeof(ReceiptResponse))]
        public DataResponse DoSunPassDocumentsPayment(DocumentsPaymentRequest request)
        {
            var doDocumentsInquiryResponse = _blackstonePosService.DoSunpassDocumentsPayment(request);

            return doDocumentsInquiryResponse;
        }

        #endregion
    }
}
