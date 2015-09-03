//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace BlackstonePos.Data.EFModels
{
    using System;
    using System.Collections.Generic;
    
    public partial class view_cashiers
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public int MerchantId { get; set; }
        public string MerchantPassword { get; set; }
        public System.DateTime TimeStamp { get; set; }
        public Nullable<bool> Status { get; set; }
        public Nullable<bool> IsMerchant { get; set; }
        public int MerchantTerminalID { get; set; }
        public Nullable<int> MerchantProfileID { get; set; }
        public decimal TodaySales { get; set; }
        public decimal DailyCreditLimit { get; set; }
        public decimal WeeklyCreditLimit { get; set; }
        public Nullable<decimal> DaylyBalance { get; set; }
        public Nullable<decimal> WeeklyBalance { get; set; }
        public string MerchantBusinessName { get; set; }
        public string MerchantBusinessAddress { get; set; }
        public string MerchantBusinessPhone { get; set; }
        public Nullable<int> isFullcarga { get; set; }
    }
}
