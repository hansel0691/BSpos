using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Services.Infrastructure
{
    public static class CommonValues
    {
            #region Monetra Config Keys

            public static string DevEnvairoment { get { return "DevEnvairoment"; } }

            public static string MonetraTestingUrl { get { return "MonetraTestingURL"; } }

            public static string MonetraUrl { get { return "MonetraURL"; } }

            public static string MonetraMid { get { return "MonetraMid"; } }

            public static string MonetraTestingMid { get { return "MonetraTestingMid"; } }

            public static string MonetraTestingCid { get { return "MonetraTestingCid"; } }

            public static string MonetraTestingTransactionType { get { return "MonetraTestingTransactionType"; } }

            public static string MonetraTestingAppType { get { return "MonetraTestingAppType"; } }

            public static string MonetraTestingAppKey { get { return "MonetraTestingAppKey"; } }

            public static string CreditUserName { get { return "CreditUserName"; } }

            public static string CreditPassword { get { return "CreditPassword"; } }

            public static string CheckUserName { get { return "CheckUserName"; } }

            public static string CheckPassword { get { return "CheckPassword"; } }

            public static string MonetraAppType { get { return "CreditAppType"; } }

            public static string CreditAppKey { get { return "CreditAppKey"; } }

            public static string CheckAppKey { get { return "CheckAppKey"; } }

            public static string MonetraCid { get { return "MonetraCid"; } }

            public static string CheckAppType { get { return "CheckAppType"; } }

            public static string CheckTid { get { return "CheckTID"; } }

            public static string BankId { get { return "BankId"; } }

            public static string CheckType { get { return "CheckType"; } }

            public static string CreditType { get { return "CreditType"; } }

            #endregion

            public static string PaymentTypeAch { get { return "ACH"; } }

            public static string PaymentTypeChecking { get { return "CHK"; } }

            public static string PaymentTypeCreditCard { get { return "credit"; } }

            public static string CompanyName { get { return "Blackstone"; } }

            public static string PaymentHistorySuccessNote { get { return "Success"; } }

            public static string PaymentHistoryNullResposeNote { get { return "NULL Response"; } }

            public static string AchAccountNotExistMessage { get { return "The especified ACH account not exist!"; } }

            public static string MonetraTestingUserNameAppKey { get { return "MonetraTestingUserName"; } }

            public static string MonetraTestingPasswordAppKey { get { return "MonetraTestingPassword"; } }

            public static string LogTagForServiceEntryMethodName { get { return "Service entry method name"; } }

            public static string LogTagForServiceNextMethodName { get { return "service next method name"; } }

            public static string LogTagForErrorMessage { get { return "Error message"; } }

            public static string LogTagForMonetraUrl { get { return "monetra url"; } }

            public static string CreditCardPaymentType { get { return "credit"; } }

            public static string CreditCardNotExistMessage { get { return "The especified credit card account not exist!"; } }

            public static string PaymentCouldNotBeCompleted { get { return "Payment could not be completed, please contact customer service"; } }

            public static string PaymentWasCompleted { get { return "Payment was success. "; } }

            public static string ErrorAfterPaymentCompleted { get { return "An error occurred after payment, it was necessary to make a refund. "; } }

            public static string RefundSuccess { get { return "Refund was success. "; } }

            public static string RefundError { get { return "Refund could not be completed, please contact customer service. "; } }

            public static string NullSaleDebitResponseMessage { get { return "Null sale debit response"; } }

            public static string NullSaleWithTokenResponseMessage { get { return "Null sale with token response"; } }

            public static string SaleDebitResponseNotOkMessage { get { return "Sale debit response was not OK"; } }

            public static string SaleWithTokenResponseNotOkMessage { get { return "Sale with token response was not OK"; } }

            public static string InternalErrorInPaymentMerchant { get { return "_PaymentHistoryRepository.AddPaymentMerchant return false"; } }

            public static string InternalErrorInUpdatePaymentHistory { get { return "_PaymentHistoryRepository.Update return false "; } }

            public static string MeteleProductCode { get { return "302107"; } }
    }
}
