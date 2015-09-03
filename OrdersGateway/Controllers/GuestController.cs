using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using BlackstonePos.Domain.Contracts.Repositories;
using BlackstonePos.Domain.Contracts.Services;
using BlackstonePos.Domain.Models;
using OrdersGateway.Filters;

namespace OrdersGateway.Controllers
{
    [SkipAuthentication]
    //[ApiExplorerSettings(IgnoreApi = true)]
    public class GuestController : ApiController
    {
        private readonly IApplicantRepository _applicantRepository;
        private readonly IGuestRepository _guestRepository;
        private readonly IBlackstonePosService _blackstonePosService;

        public GuestController(IBlackstonePosService blackstonePosService, 
                               IApplicantRepository applicantRepository, 
                               IGuestRepository guestRepository)
        {
            _blackstonePosService = blackstonePosService;
            _applicantRepository = applicantRepository;
            _guestRepository = guestRepository;
        }


        [HttpPost]
        public BaseResponse SubmitApplication(Applicant applicant)
        {
            var submissionResult = _blackstonePosService.AddItem(_applicantRepository, applicant);

            var status = submissionResult != null ? 200 : 201;

            var message = submissionResult != null ? string.Empty : "Erros trying to add new applicant.";

            return new BaseResponse
            {
                Status = status,
                ErrorMessage = message
            };
        }

        [HttpPost]
        public BaseResponse SubmitGuest(Guest applicant)
        {
            var submissionResult = _blackstonePosService.AddItem(_guestRepository, applicant);

            var status = submissionResult != null ? 200 : 201;

            var message = submissionResult != null ? string.Empty : "Erros trying to add new guest Info.";

            return new BaseResponse
            {
                Status = status,
                ErrorMessage = message
            };
        }
    }
}
