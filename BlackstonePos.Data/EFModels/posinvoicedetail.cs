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
    
    public partial class posinvoicedetail
    {
        public int det_id { get; set; }
        public int inv_id { get; set; }
        public Nullable<int> inv_carrier_fk { get; set; }
        public string inv_car_name { get; set; }
        public Nullable<int> inv_pin_fk { get; set; }
        public Nullable<double> inv_pin_controlno { get; set; }
        public Nullable<System.DateTime> inv_det_date { get; set; }
        public string product_sbt { get; set; }
        public string item_fk { get; set; }
        public string pro_description { get; set; }
        public Nullable<int> terminal_fk { get; set; }
        public Nullable<int> trn_quantity { get; set; }
        public Nullable<decimal> pro_denomination { get; set; }
        public Nullable<decimal> inv_Discount { get; set; }
        public Nullable<decimal> inv_subtotal { get; set; }
        public Nullable<int> inv_transaction_fk { get; set; }
        public Nullable<int> inv_Product_Isforeign { get; set; }
        public string inv_TransactionType { get; set; }
        public string inv_Cashier { get; set; }
        public Nullable<int> AccountingId { get; set; }
        public Nullable<decimal> ProductCost { get; set; }
        public Nullable<decimal> AgentCommission { get; set; }
        public Nullable<decimal> MDistCommission { get; set; }
        public Nullable<decimal> DistCommission { get; set; }
        public Nullable<int> AgentId { get; set; }
        public Nullable<int> MDistId { get; set; }
        public Nullable<int> DistId { get; set; }
        public Nullable<System.DateTime> CommissionPaidDate { get; set; }
        public Nullable<bool> ProcessedInDirectBilling { get; set; }
        public Nullable<int> PaymentMethod { get; set; }
        public Nullable<decimal> PaymentFee { get; set; }
        public Nullable<int> inv_OpenCreditID { get; set; }
        public Nullable<double> SalesTaxPerc { get; set; }
        public Nullable<decimal> SalesTaxAmt { get; set; }
        public Nullable<decimal> void_amount { get; set; }
        public string CCardAuthCode { get; set; }
        public string CCardRefNumber { get; set; }
        public string CCardNumber { get; set; }
        public Nullable<decimal> Profit { get; set; }
        public Nullable<int> Iscomm { get; set; }
        public Nullable<int> WasPaidComm { get; set; }
        public Nullable<System.DateTime> paidcommdate { get; set; }
        public Nullable<int> paidcommuser { get; set; }
        public Nullable<bool> BartellTransFeeBilled { get; set; }
        public string CCardExpDate { get; set; }
        public Nullable<decimal> DistCommission2 { get; set; }
        public Nullable<decimal> ReturnedTax { get; set; }
        public Nullable<bool> ReversalPaid { get; set; }
        public Nullable<decimal> freedescriptionCost { get; set; }
        public Nullable<int> gl_id_tnb { get; set; }
        public Nullable<int> gl_id_cost_tnb { get; set; }
        public Nullable<decimal> Original_Discount { get; set; }
        public Nullable<decimal> Original_Subtotal { get; set; }
        public Nullable<System.DateTime> det_timestamp { get; set; }
        public string det_calculatedfrom { get; set; }
        public Nullable<decimal> previousCost { get; set; }
        public string phone_number { get; set; }
        public Nullable<int> ITC_Billing_Status { get; set; }
        public Nullable<int> ITC_id { get; set; }
        public Nullable<int> ITC_PoId { get; set; }
        public Nullable<decimal> topup_loaded_amount { get; set; }
        public Nullable<decimal> new_product_discount { get; set; }
    }
}
