using System;
using System.Collections.Generic;
using BlackstonePos.Domain.Contracts.Repositories;
using BlackstonePos.Domain.Models;
using Metele.common.Models;
using Metele.common.Models.PaxTerminal;
using Metele.common.Models.Products.BillPayment;
using Metele.common.Models.Products.DirectTv;
using Cashier = BlackstonePos.Domain.Models.Cashier;

namespace BlackstonePos.Domain.Contracts.Services
{
    public interface IBlackstonePosService
    {
        T GetItem<T>(IBaseRepository<T> repository, int id);

        T AddItem<T>(IBaseRepository<T> repository, T item);

        IEnumerable<T> Get<T>(IBaseRepository<T> repository);

        bool Delete<T>(IBaseRepository<T> repository,int id);

        bool Update<T>(IBaseRepository<T> repository, T entity);

        Cashier FindCashier(int merchantId, string password);

        Cashier FindMerchant(int merchantId);

        bool IsBlackstonePosMerchant(int merchantId);

        IEnumerable<BlackstonePos.Domain.Models.Promotion> GetAllPromotions(int merchantId);

        Models.Setting GetSettings(int merchantId);

        int FindPayment(string accountNumber, string routingNumber);

        void LogInfo(string controller, string action, string message, IDictionary<string, object> parameters);
        void LogInfo(string controller, string action, string message, string jsonData);

        void LogDebug(string controller, string action, Exception exception);

        DataResponse DoSunpassReplenishment(SunpassReplenishmentRequest sunpassReplenishmentRequest);

        DataResponse DoSunpassDocumentsPayment(DocumentsPaymentRequest documentsInquiryRequest);
        
        DataResponse GetSinglePin(PosRequest singlePinRequest);

        DataResponse DoTopUp(PosRequest topUpRequest);

        DataResponse DoBillPayment(PosBillPaymentRequest posBillPaymentRequest);

        DataResponse DoBillPaymentNextStep(PosBillPaymentRequest posBillPaymentRequest);

        DataResponse GetProducts(int merchantId, string terminalId, string password, string operatorName);

        DataResponse GetProducts(int merchantId, string terminalId, string password, string operatorName,string category, int count);

        DataResponse GetProductRates(int merchantId, string terminalId, string password, string operatorName, string productMainCode);
        
        DataResponse GetProductDenominations(string merchantId, string terminalId, string password,string operatorName, string productMainCode);

        DataResponse GetMostSoldProducts(int merchantId, string terminalId, string password, string operatorName, string category, int? amount);

        DataResponse GetProduct(int merchantId, string terminalId, string password, string operatorName, string productMainCode);

        DataResponse GetProduct(int merchantId, string productMainCode);

        DataResponse GetCarriers(int merchantId, string terminalId, string merPassword, string operatorUsername, string category);

        DataResponse GetProductsByCarrier(int merchantId, string terminalId, string password, string operatorUsername, string category, string carrierName);

        DataResponse GetProductsByCountry(int merchantId, string terminalId, string password, string operatorUsername, string category, string countryCode);

        DataResponse GetSunpassTransporderInfo(SunpassBalanceInfoRequest balanceRequest);

        DataResponse GetSunpassDocumentsInfo(DocumentsInquiryRequest documentsInquiryRequest);
        
        DataResponse GetSavedPayments(string merchantId);

        DataResponse GetProductAccessNumbers(int merchantId, string terminalId, string merPassword, string operatorUsername, string productMainCode);
        
        DataResponse GetCarriersInitials(int merchantId, string terminalId, string merPassword, string operatorUsername, string category);

        DataResponse GetActiveMainProducts(int merchantId);

        #region Bill Payment

        //DataResponse GetBillPaymentCategories(PosBillPaymentRequest posCredentials);

        //DataResponse GetBillerPaymentOptions(PosBillPaymentRequest posCredentials);

        //DataResponse GetBillersByCategory(PosBillPaymentRequest posCredentials);

        //DataResponse GetMasterBillerOptions(PosBillPaymentRequest posCredentials);

        #endregion

        #region Pax Terminal Operations

        IEnumerable<PaxTerminalOrder> GetOrders(int merchantId, int terminalId, string serialNumber);

        PaxTerminalResponse ExecuteOrder(int merchantId, int terminalId, int orderNumber, string serialNumber, bool processingMode);

        PaxTerminalResponse RePrintOrder(int merchantId, int terminalId, int orderNumber, string serialNumber);

        PaxTerminalResponse ConfirmOrder(int merchantId, int terminalId, int orderNumber, string serialNumber);

        bool ValidateCredentialsBySerialNumber(int merchantId, int terminalId, string serialNumber);

        PaxTerminalResponse GetPaxTerminalSales(int merchantId, string startDate, string endDate, int terminalId, string serialNumber);
        #endregion

        BaseResponse SendSmsConfirmation(ReceiptResponse receipt, int merchantId, string phoneNumber);
        DataResponse GetDirectTvCategories();
        DataResponse GetDirectTvProductsByCategory(int category);
        DataResponse GetDirectTvProduct(int productId);
        DataResponse GetDirectTvAllProducts();
        DataResponse AddOrderForPaxTerminal(PaxTerminalTransactionRequest orderRequest);
        void CheckCredentials(int merchantId, int terminalId, string serialNumber);
        string ValidatePosAddOrderRequest(OrderRequest orderRequest);
        BaseResponse RefundOrder(int merchantId, int orderId);
        BaseResponse ResendConfirmationMessage(int orderId);
        string GetFullCargaSmsFormat(ReceiptResponse receipt, int merchantId);
        void ExportToCsvFile<T>(List<T> data, string fileName);
        IEnumerable<Order> GetAllValidOrders(int merchantId, DateTime startDate, DateTime endDate);

        string FullcargaAccessNumberTest(int merchantId, string productMainCode);


        ReceiptResponse GetReceiptResponse(PaxTerminalTransactionRequest request, BrokerResponse brokerResponse);
    } 
}
