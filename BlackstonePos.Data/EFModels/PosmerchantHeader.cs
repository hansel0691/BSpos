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
    
    public partial class PosmerchantHeader
    {
        public Nullable<int> PosCustomerType_fk { get; set; }
        public int merchant_pk { get; set; }
        public string custno_fk { get; set; }
        public Nullable<bool> eCommerceFlag { get; set; }
        public Nullable<bool> PosdispenserFlag { get; set; }
        public string mer_name { get; set; }
        public Nullable<System.DateTime> mer_AppDate { get; set; }
        public string mer_ProcessingCo { get; set; }
        public string mer_LeasingCo { get; set; }
        public string mer_TID { get; set; }
        public string mer_MID { get; set; }
        public string mer_MIDBank { get; set; }
        public string mer_LeaseAccount { get; set; }
        public Nullable<bool> mer_InfoIsComplete { get; set; }
        public string mer_zip { get; set; }
        public string mer_telno { get; set; }
        public string mer_crlimit { get; set; }
        public string mer_Notes { get; set; }
        public Nullable<int> mer_status { get; set; }
        public Nullable<decimal> mer_mxtrans { get; set; }
        public string mer_password { get; set; }
        public Nullable<System.DateTime> mer_timestamp { get; set; }
        public string mer_useradder { get; set; }
        public Nullable<System.DateTime> mer_dateadded { get; set; }
        public string mer_usereditor { get; set; }
        public Nullable<System.DateTime> mer_dateeditor { get; set; }
        public Nullable<System.DateTime> mer_processed { get; set; }
        public Nullable<bool> mer_gelapproved { get; set; }
        public Nullable<bool> mer_usbapproved { get; set; }
        public Nullable<bool> mer_posdelivery { get; set; }
        public Nullable<bool> mer_callingcard { get; set; }
        public Nullable<bool> mer_creditcard { get; set; }
        public Nullable<bool> mer_SaleActive { get; set; }
        public Nullable<decimal> mer_CreditSales { get; set; }
        public string mer_apptype { get; set; }
        public Nullable<int> mer_creditScore { get; set; }
        public Nullable<bool> mer_paymentCleared { get; set; }
        public Nullable<bool> mer_funded { get; set; }
        public Nullable<int> posdeals_fk { get; set; }
        public Nullable<int> agentId { get; set; }
        public Nullable<int> distributorId { get; set; }
        public Nullable<int> mdistributorid { get; set; }
        public Nullable<int> merchantProfId { get; set; }
        public Nullable<int> AgentProfId { get; set; }
        public Nullable<int> distributorProfId { get; set; }
        public Nullable<int> mdistributorProfId { get; set; }
        public Nullable<int> placementAgentId { get; set; }
        public Nullable<int> placementAgentProfId { get; set; }
        public Nullable<System.DateTime> datefunded { get; set; }
        public Nullable<System.DateTime> datedeployed { get; set; }
        public Nullable<System.DateTime> datecleared { get; set; }
        public Nullable<int> executiveid { get; set; }
        public Nullable<int> executiveprofid { get; set; }
        public Nullable<decimal> buybackamt { get; set; }
        public Nullable<decimal> leasepayoff { get; set; }
        public Nullable<float> processingrate { get; set; }
        public Nullable<float> transactionfee { get; set; }
        public Nullable<System.DateTime> dateclosed { get; set; }
        public string creditType { get; set; }
        public bool suspended { get; set; }
        public Nullable<System.DateTime> suspended_date { get; set; }
        public string suspended_reason { get; set; }
        public string posnotes { get; set; }
        public Nullable<int> repcommission_fk { get; set; }
        public Nullable<bool> commission { get; set; }
        public Nullable<bool> payplacement { get; set; }
        public Nullable<bool> ach { get; set; }
        public string billday { get; set; }
        public Nullable<System.DateTime> ach_monthlyFeeDate { get; set; }
        public string LeaseCreditType { get; set; }
        public string LeaseCredit { get; set; }
        public Nullable<System.DateTime> dateapproved { get; set; }
        public Nullable<System.DateTime> dateinstalled { get; set; }
        public Nullable<float> creditFactor { get; set; }
        public decimal achmonthlyfee { get; set; }
        public Nullable<int> achfrequency { get; set; }
        public string AgencyNo { get; set; }
        public string ProducerNo { get; set; }
        public string OtherMid { get; set; }
        public Nullable<int> AgencyId { get; set; }
        public Nullable<int> AgencyProfId { get; set; }
        public Nullable<System.DateTime> DateVerified { get; set; }
        public decimal CreditLimit { get; set; }
        public Nullable<int> InstallerId { get; set; }
        public decimal AchRentalFee { get; set; }
        public Nullable<System.DateTime> ach_RentalFeeDate { get; set; }
        public Nullable<bool> ach_immediately { get; set; }
        public System.DateTime datescanned { get; set; }
        public bool nocostmerchant { get; set; }
        public Nullable<decimal> DailyLimit { get; set; }
        public string usbcontrolno { get; set; }
        public Nullable<System.DateTime> LastBillDate { get; set; }
        public string CloseType { get; set; }
        public Nullable<int> pcs_fk { get; set; }
        public string repname { get; set; }
        public Nullable<bool> achStop { get; set; }
        public Nullable<System.DateTime> achChangeDate { get; set; }
        public string achChangeUser { get; set; }
        public string achChangeNotes { get; set; }
        public Nullable<System.DateTime> achOperationDate { get; set; }
        public Nullable<int> achLastOpe { get; set; }
        public Nullable<decimal> CreditLimitBck { get; set; }
        public Nullable<int> FactoryRepId { get; set; }
        public Nullable<short> leadsourceid { get; set; }
        public Nullable<decimal> achMaxDebtAmount { get; set; }
        public Nullable<decimal> achMinDebtAmount { get; set; }
        public Nullable<bool> BillingSetup { get; set; }
        public Nullable<System.DateTime> BillingSetupDate { get; set; }
        public Nullable<System.DateTime> BillingEditedDate { get; set; }
        public Nullable<bool> ApplyAmountsRules { get; set; }
        public Nullable<System.DateTime> BeginACHDate { get; set; }
        public Nullable<System.DateTime> dateappointment { get; set; }
        public byte trialperiod { get; set; }
        public Nullable<decimal> PremiumReplacementFee { get; set; }
        public Nullable<System.DateTime> PremiumReplacementFeeDate { get; set; }
        public Nullable<System.DateTime> LastBillDateBak { get; set; }
        public Nullable<bool> active { get; set; }
        public string DeploymentTrackingNo { get; set; }
        public string LeaseNo { get; set; }
        public Nullable<System.DateTime> DateTransferred { get; set; }
        public Nullable<int> TransferredTo { get; set; }
        public Nullable<int> TransferredFrom { get; set; }
        public Nullable<bool> suspendcreditcardprocessing { get; set; }
        public bool FirstLastPmtUponInstall { get; set; }
        public bool FirstLastPaymentWaived { get; set; }
        public Nullable<int> SendStatement { get; set; }
        public int TeleMarketerId { get; set; }
        public int TeleMarketerProfId { get; set; }
        public bool GiftCardProcessing { get; set; }
        public Nullable<int> ACHcomp { get; set; }
        public bool TotalCheckProcessing { get; set; }
        public bool IgnoreBillingRules { get; set; }
        public Nullable<bool> Compliance { get; set; }
        public bool Demo { get; set; }
        public string PaymentType { get; set; }
        public string ProcessingType { get; set; }
        public string OtherInfo { get; set; }
        public int Bucket_fk { get; set; }
        public string UsbStatus { get; set; }
        public bool VSAgreement { get; set; }
        public Nullable<System.DateTime> VSAgreementDate { get; set; }
        public bool VSSubAgreement { get; set; }
        public Nullable<System.DateTime> VSSubAgreementDate { get; set; }
        public string MasterDealerType { get; set; }
        public string SubDealerType { get; set; }
        public Nullable<System.DateTime> AppSentDate { get; set; }
        public Nullable<System.DateTime> VsSent { get; set; }
        public Nullable<System.DateTime> VsOk { get; set; }
        public Nullable<System.DateTime> refusedate { get; set; }
        public string refusereason { get; set; }
        public long MissingTotal { get; set; }
        public int PenMer_fk { get; set; }
        public decimal MonthlyServiceFee { get; set; }
        public string ClubNameSave { get; set; }
        public Nullable<int> ServiceRepId { get; set; }
        public Nullable<System.DateTime> AppReceivedDate { get; set; }
        public string StateTaxCertification { get; set; }
        public int AccountStatus { get; set; }
        public Nullable<decimal> PrepaidBalance { get; set; }
        public Nullable<bool> PrepaidMerchant { get; set; }
        public byte Language_fk { get; set; }
        public int AccountOpener { get; set; }
        public string LeaseVerificationNo { get; set; }
        public Nullable<System.DateTime> DatePackageReceived { get; set; }
        public Nullable<int> ReferralNo { get; set; }
        public bool GoldPackage { get; set; }
        public decimal ComAdj { get; set; }
        public string ComAdjUser { get; set; }
        public bool HoldCom { get; set; }
        public string HoldComUser { get; set; }
        public int ComDrawDet_fk { get; set; }
        public Nullable<decimal> CurrentBalance { get; set; }
        public decimal GoldPackageFee { get; set; }
        public Nullable<System.DateTime> LeaseFileProcessed { get; set; }
        public Nullable<bool> Vending { get; set; }
        public string BSRating { get; set; }
        public Nullable<System.DateTime> GoldPackageFeeDate { get; set; }
        public Nullable<int> mer_size { get; set; }
        public Nullable<System.DateTime> MonthlyServiceFeeDate { get; set; }
        public bool donotvisit { get; set; }
        public bool equipmentPickedUp { get; set; }
        public Nullable<decimal> bckprepaidbalance { get; set; }
        public string SuperChargeID { get; set; }
        public Nullable<int> VendingType { get; set; }
        public Nullable<int> VendingStatus { get; set; }
        public Nullable<System.DateTime> DisplayDate { get; set; }
        public Nullable<System.DateTime> DateLastUSBRequest { get; set; }
        public Nullable<int> IsAtrial { get; set; }
        public Nullable<System.DateTime> TrialDate { get; set; }
        public Nullable<int> AchToDist { get; set; }
        public Nullable<decimal> WeeklyACHValue { get; set; }
        public Nullable<System.DateTime> WeeklyACHDate { get; set; }
        public Nullable<int> IsGold { get; set; }
        public Nullable<int> MonthlyInstallments { get; set; }
        public Nullable<decimal> MonthlyinstallmentsAmount { get; set; }
        public Nullable<decimal> AmountInstalled { get; set; }
        public Nullable<int> PaidTelesalesLease { get; set; }
        public Nullable<int> PaidAELease { get; set; }
        public Nullable<int> PaidTelesalesPurchase { get; set; }
        public Nullable<int> PaidAEPurchase { get; set; }
        public Nullable<int> PaidTelesalesRep { get; set; }
        public Nullable<int> PaidAERep { get; set; }
        public Nullable<int> PaidTeleSalesInst { get; set; }
        public Nullable<int> PaidAEInst { get; set; }
        public Nullable<int> PaidReferal { get; set; }
        public Nullable<System.DateTime> PendingNextCicleDate { get; set; }
        public string ReferalName { get; set; }
        public Nullable<int> ReferalId { get; set; }
        public Nullable<int> catalogTemp_fk { get; set; }
        public Nullable<int> CompanyID { get; set; }
        public Nullable<int> whatis { get; set; }
        public Nullable<bool> formerPOS { get; set; }
        public Nullable<int> CP_AccountID { get; set; }
        public Nullable<int> PaidMonthlyRep { get; set; }
        public Nullable<int> paidWeeklyRep { get; set; }
        public string mer_MIDBankBck { get; set; }
        public Nullable<int> paiddealerlease { get; set; }
        public Nullable<int> paiddealerpurchase { get; set; }
        public Nullable<int> nopaymentdealer { get; set; }
        public Nullable<System.DateTime> pendingdealernext { get; set; }
        public string userremovedT { get; set; }
        public Nullable<System.DateTime> dateremovedT { get; set; }
        public Nullable<bool> Blocked { get; set; }
        public string ProcessorTID { get; set; }
        public Nullable<int> PendingRepIn { get; set; }
        public Nullable<int> PendingRepOut { get; set; }
        public Nullable<int> IsIpp { get; set; }
        public string IppTerminal { get; set; }
        public Nullable<int> autoAdjustCreditLimit { get; set; }
        public Nullable<int> Lpd { get; set; }
        public Nullable<int> PaymentsDue { get; set; }
        public Nullable<decimal> AmountLPD { get; set; }
        public Nullable<System.DateTime> RejectedDate { get; set; }
        public string ReasonLpd { get; set; }
        public Nullable<System.DateTime> ProjectedCBack { get; set; }
        public Nullable<int> noprinter { get; set; }
        public Nullable<int> PaidRental { get; set; }
        public Nullable<int> jobcompliancedb { get; set; }
        public Nullable<int> IPPPaid { get; set; }
        public string financeId1 { get; set; }
        public string financeId2 { get; set; }
        public string financeId3 { get; set; }
        public string financeId4 { get; set; }
        public string financeId5 { get; set; }
        public string financeId1_user { get; set; }
        public string financeId1_password { get; set; }
        public string financeId2_user { get; set; }
        public string financeId2_password { get; set; }
        public string financeId3_user { get; set; }
        public string financeId3_password { get; set; }
        public string financeid4_user { get; set; }
        public string financeid4_password { get; set; }
        public string financeid5_user { get; set; }
        public string financeid5_password { get; set; }
        public Nullable<int> visit_freq { get; set; }
        public Nullable<System.DateTime> Last_visit { get; set; }
        public Nullable<System.DateTime> Next_visit { get; set; }
        public Nullable<int> IsADealerMerchant { get; set; }
        public Nullable<int> IsPlanC { get; set; }
        public Nullable<int> IsSplit { get; set; }
        public Nullable<System.DateTime> usbStatusUpdated { get; set; }
        public Nullable<int> mer_intercompany { get; set; }
        public Nullable<int> recplan { get; set; }
        public Nullable<double> recplanpercent { get; set; }
        public Nullable<bool> mer_couldbemarket { get; set; }
        public Nullable<bool> mer_isCorporate { get; set; }
        public Nullable<bool> mer_isServiceFeeOnly { get; set; }
        public Nullable<int> mer_CorporateDiscount { get; set; }
        public Nullable<int> PRTid { get; set; }
        public Nullable<decimal> BalanceMC { get; set; }
        public Nullable<decimal> CreditLimitMC { get; set; }
        public Nullable<int> BlueProgram { get; set; }
        public Nullable<int> IprepayID { get; set; }
        public Nullable<int> liability { get; set; }
        public Nullable<int> MS_ID { get; set; }
        public Nullable<int> freqfee { get; set; }
        public string byPassMid { get; set; }
        public Nullable<System.DateTime> closedate { get; set; }
        public Nullable<int> ACECenter { get; set; }
        public Nullable<int> mer_overwriteCost { get; set; }
        public Nullable<decimal> mspercent { get; set; }
        public Nullable<bool> check_product_profile_on_sale { get; set; }
        public Nullable<int> isOR { get; set; }
        public Nullable<int> isFuji { get; set; }
        public Nullable<int> Fuji_RollCounter { get; set; }
        public Nullable<int> Fuji_LastRollStatus { get; set; }
        public Nullable<int> Fuji_RollsBox { get; set; }
        public Nullable<int> Fuji_paperBox { get; set; }
        public Nullable<bool> mer_promotion { get; set; }
        public Nullable<int> noreconreport { get; set; }
        public Nullable<double> tnbcom_sales_tax { get; set; }
        public Nullable<int> IsPrepaidDist { get; set; }
        public string ipphost { get; set; }
        public string MserviceRef2Name { get; set; }
        public Nullable<double> MserviceRef2Per { get; set; }
        public Nullable<int> MserviceRef2 { get; set; }
        public Nullable<bool> creditsOnReport { get; set; }
        public Nullable<int> IsDtvPP { get; set; }
        public string PRMethod { get; set; }
        public Nullable<int> AchPrflag { get; set; }
        public Nullable<int> IppTrial { get; set; }
        public Nullable<int> SunPassAgentId { get; set; }
        public string SunPassAgent { get; set; }
        public Nullable<int> IsSpg { get; set; }
        public Nullable<int> SpgTerminal { get; set; }
        public Nullable<bool> MonitorForFraud { get; set; }
        public Nullable<int> Iphone { get; set; }
        public Nullable<int> isEzPassType { get; set; }
        public Nullable<System.DateTime> SpgDate { get; set; }
        public Nullable<int> ReceiptType { get; set; }
        public Nullable<int> isMeteleUSA { get; set; }
        public string MservicePlatform { get; set; }
        public string MserviceRisk { get; set; }
        public Nullable<int> TmAgentId { get; set; }
        public Nullable<int> PaidTm { get; set; }
        public Nullable<int> isEcommerce { get; set; }
        public Nullable<int> TmAgentTBid { get; set; }
        public Nullable<int> TmAgentBPid { get; set; }
        public Nullable<int> PaidTmBP { get; set; }
        public Nullable<decimal> merchantBalance { get; set; }
        public Nullable<int> isFastTrack { get; set; }
        public Nullable<bool> onlineMerchant { get; set; }
        public Nullable<bool> onlineVerified { get; set; }
        public Nullable<System.DateTime> onlineVerifiedDate { get; set; }
        public Nullable<int> onlineVerifiedBy { get; set; }
        public Nullable<int> checkserial { get; set; }
        public string OnePointDisposition { get; set; }
        public Nullable<System.DateTime> OnePointDispositionDate { get; set; }
        public string OnePointAmexSEN { get; set; }
        public Nullable<int> onBsGateway { get; set; }
        public Nullable<int> isTaxable { get; set; }
        public Nullable<int> isTCA { get; set; }
        public Nullable<int> IsMobileMerchant { get; set; }
        public Nullable<bool> fromUnlimitedPINs { get; set; }
        public Nullable<double> tnb_tax { get; set; }
        public Nullable<int> isNextCala360 { get; set; }
        public string GatewayType { get; set; }
        public string OtherMobileMerchants { get; set; }
        public Nullable<int> paidMeteleSpiff { get; set; }
        public Nullable<int> paidMeteleBonus { get; set; }
        public Nullable<int> excludeFromBoosting { get; set; }
        public Nullable<int> wasFuji { get; set; }
        public string catalogVersion { get; set; }
        public Nullable<int> isKaching { get; set; }
        public Nullable<int> isMassDOT { get; set; }
    }
}
