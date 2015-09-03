using System;
using System.Collections;


namespace BlackstonePos.Domain.Models
{
    public class DataResponse:BaseResponse
    {
        public dynamic Data { get; set; }

        public int Count { get; set; }

        public DataResponse()
        {
            
        }

        public DataResponse(Exception exception): base(exception)
        { }

        public DataResponse(Exception exception, string controller, string action) : base(exception, controller, action)
        {
            
        }

    }
}