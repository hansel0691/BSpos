using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OrdersGateway.Models
{
    public class DateRange
    {
        public DateRange(DateTime startDate, DateTime endDate)
        {
            StartDate = startDate;
            EndDate = endDate;
        }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }
    }

    public enum DateType
    {
        Today, Yesterday, Month, Range
    }
}