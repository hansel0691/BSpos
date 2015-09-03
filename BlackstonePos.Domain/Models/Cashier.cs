using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlackstonePos.Domain.Models
{
    public class Cashier: PosCredentials
    {
        public int Id { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public DateTime? TimeStamp { get; set; }
        public bool? Status { get; set; }
        public int? MerchantProfileID { get; set; }
        public int? MerchantTerminalID { get; set; }
        public bool? IsMerchant { get; set; }
        public decimal TodaySales { get; set; }
        public decimal DailyCreditLimit { get; set; }
        public decimal WeeklyCreditLimit { get; set; }
        public decimal? DaylyBalance { get; set; }
        public decimal? WeeklyBalance { get; set; }
        public string MerchantBusinessName { get; set; }
        public string MerchantBusinessAddress { get; set; }
        public string MerchantBusinessPhone { get; set; }
        public bool IsFullCarga { get; set; }
        public string CustomerService { get; set; }
    }
}
