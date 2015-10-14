using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using BlackstonePos.Domain.Contracts.Services;
using Metele.common.Contracts.Services;
using Metele.common.Models.PaxTerminal;
using Metele.data.CustomExceptions;
using Ninject.Extensions.Logging;
using OrdersGateway.Filters;
using OrdersGateway.Models;

namespace OrdersGateway.Controllers
{
    //[ApiExplorerSettings(IgnoreApi = true)]
    public class SalesController : ApiController
    {
        private readonly IMeteleService _paxTerminalService;
        private readonly IBlackstonePosService _blackstonePosService;
        private readonly ILogger _logger;

        public SalesController(IMeteleService aService, ILogger logger, IBlackstonePosService blackstonePosService)
        {
            _paxTerminalService = aService;
            _logger = logger;
            _blackstonePosService = blackstonePosService;
        }

        [HttpPost]
        [SkipAuthentication]
        public PaxTerminalResponse GetPaxTerminalSales([FromBody] SalesWebRequest webRequest)
        {
            var isBlackstonePos = IsBlackstonePosMerchant(webRequest.MerchantId);

            return isBlackstonePos ? GetPaxTerminalSalesForBlackstonePos(webRequest) : GetPaxTerminalSalesForMetele(webRequest);
        }

        #region Aux Operations
        private DateRange GetDateRange(int dateType, string startDate, string endDate)
        {
            try
            {

                switch (dateType)
                {
                    case (int)DateType.Today: return new DateRange(DateTime.Today, DateTime.Now);
                    case (int)DateType.Yesterday: return new DateRange(DateTime.Today.AddDays(-1), DateTime.Today.AddSeconds(-1));
                    case (int)DateType.Month: return new DateRange(new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1), DateTime.Now);
                    default: return new DateRange(DateTime.Parse(startDate), DateTime.Parse(endDate));
                }
            }
            catch (Exception)
            {
                return null;
            }

        }

        private bool IsBlackstonePosMerchant(int merchantId)
        {
            var isBlaclakstonePos = _blackstonePosService.IsBlackstonePosMerchant(merchantId);

            return isBlaclakstonePos;
        }
        private PaxTerminalResponse GetPaxTerminalSalesForMetele([FromBody] SalesWebRequest webRequest)
        {
            try
            {
                var dateRange = GetDateRange(webRequest.DateType, webRequest.StartDate, webRequest.EndDate);

                var serviceResponse = _paxTerminalService.GetPaxTerminalSales(webRequest.MerchantId, dateRange.StartDate.ToString(), dateRange.EndDate.ToString(), webRequest.TerminalId, webRequest.SerialNumber);

                return serviceResponse;
            }
            catch (Exception exception)
            {
                if (exception is CustomException)
                {
                    var customException = exception as CustomException;

                    _logger.Debug(string.Format("Operation:GetPaxTerminalSales,Error Message:{3}, Parameters:MerchantId:{0},TerminalId:{1},SerialNumber:{2}", customException.MerchantId, customException.TerminalId, customException.SerialNumber, customException.Message));
                }
                return new PaxTerminalResponse
                {
                    ErrorMessage = exception.Message,
                    Status = 201,
                };
            }

        }

        private PaxTerminalResponse GetPaxTerminalSalesForBlackstonePos([FromBody] SalesWebRequest webRequest)
        {
            try
            {
                var dateRange = GetDateRange(webRequest.DateType, webRequest.StartDate, webRequest.EndDate);

                var serviceResponse = _blackstonePosService.GetPaxTerminalSales(webRequest.MerchantId, dateRange.StartDate.ToString(), dateRange.EndDate.ToString(), webRequest.TerminalId, webRequest.SerialNumber);

                return serviceResponse;
            }
            catch (Exception exception)
            {
                if (exception is CustomException)
                {
                    var customException = exception as CustomException;

                    _logger.Debug(string.Format("Operation:GetPaxTerminalSales,Error Message:{3}, Parameters:MerchantId:{0},TerminalId:{1},SerialNumber:{2}", customException.MerchantId, customException.TerminalId, customException.SerialNumber, customException.Message));
                }
                return new PaxTerminalResponse
                {
                    ErrorMessage = exception.Message,
                    Status = 201,
                };
            }

        }

        #endregion

    }
}
