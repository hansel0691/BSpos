using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using BlackstonePos.Domain.Models;
using Metele.common.Models;
using Metele.common.Models.PaxTerminal;
using Metele.common.Models.Products.BillPayment;
using OrdersGateway.Models;
using Order = OrdersGateway.Models.Order;

namespace OrdersGateway.Infrastructure
{

    public static class MapperHelper
    {
        

        static MapperHelper()
        {

            InitializeMaps();
        }

        private static void InitializeMaps()
        {

            Mapper.CreateMap<PaxTerminalOrder, Order>()
            .ForMember(model => model.TotalAmount, entity => entity.MapFrom(p => double.Parse(p.TotalAmount).ToString("C")))
            .ForMember(model => model.ProductName, entity => entity.MapFrom(p => p.ProductName.Length>=50? p.ProductName.Substring(0,50):p.ProductName));

            Mapper.CreateMap<PaxTerminalResponse, CommitResponse>()
                .ForMember(model => model.Status, entity => entity.MapFrom(p => p.Status == 0 ? 200:p.Status));

            Mapper.CreateMap<AchPayment, NonCreditPayment>()
                .ForMember(model => model.AccountNumber, entity => entity.MapFrom(p => p.AccountNumber))
                .ForMember(model => model.Amount, entity => entity.MapFrom(p => p.Amount))
                .ForMember(model => model.MerchantId, entity => entity.MapFrom(p => p.MerchantId))
                .ForMember(model => model.RoutingNumber, entity => entity.MapFrom(p => p.RoutingNumber))
                .ForMember(model => model.Id, entity => entity.MapFrom(p => p.Id.ToString()))
                .ForMember(model => model.SaveAccount, entity => entity.MapFrom(p => p.Saved));

            Mapper.CreateMap<BlackstonePos.Domain.Models.Cashier, GiveCashier>()
                .ForMember(model => model.merchant_fk, entity => entity.MapFrom(p => p.MerchantId))
                .ForMember(model => model.mer_password, entity => entity.MapFrom(p => p.MerchantPassword))
                .ForMember(model => model.catalogTemp_fk, entity => entity.MapFrom(p => p.MerchantProfileID))
                .ForMember(model => model.terminal_id, entity => entity.MapFrom(p => p.MerchantTerminalID))
                .ForMember(model => model.operatorName, entity => entity.MapFrom(p => p.Name));

            Mapper.CreateMap<MasterBiller, PosMasterBiller>()
                .ForMember(model => model.Name, entity => entity.MapFrom(p => p.Description));
            
            Mapper.CreateMap<OrderRequest, PaxTerminalTransactionRequest>()
                .ForMember(model => model.CashierId, entity => entity.MapFrom(p => p.MerchantId.ToString()))
                .ForMember(model => model.Country, entity => entity.MapFrom(p => p.CountryCode))
                .ForMember(model => model.TerminalId, entity => entity.MapFrom(p => p.TerminalId.ToString()))
                .ForMember(model => model.ProductId, entity => entity.MapFrom(p => p.ProductMainCode))
                .ForMember(model => model.TotalAmount, entity => entity.MapFrom(p => p.Amount.ToString()))
                ;


            Mapper.CreateMap<BlackstonePos.Domain.Models.Order, OrderViewModel>()
                .ForMember(model => model.Amount, entity => entity.MapFrom(p => p.Amount.Value.ToString("C")))
                .ForMember(model => model.Product, entity => entity.MapFrom(p => p.ProductName))
                .ForMember(model => model.OrderNumber, entity => entity.MapFrom(p => p.Id))
                .ForMember(model => model.DateTime, entity => entity.MapFrom(p => p.TimeStamp.Value.ToShortDateString()))
                .ForMember(model => model.PhoneNumber, entity => entity.MapFrom(p => p.PhoneNumber.MaskPhoneNumber()))
                .ForMember(model => model.Refunded, entity => entity.MapFrom(p => p.Refunded.HasValue && p.Refunded.Value? "Yes":"-"))
                //.ForMember(model => model.Comission, entity => entity.MapFrom(p => p.Comission.Value.ToString("C")))
                ;
        }


        /// Created By: Carlos Raul (02262014)
        ///  <summary>
        ///  Extension Method to perform a mapping between to objects with a previous well-defined Mapping
        ///  </summary>
        ///  <typeparam name="T"></typeparam>
        /// <typeparam name="TK"></typeparam>
        /// <param name="aEntity"></param>
        /// <returns></returns>
        public static TK UIMapTo<T,TK>(this T aEntity)
        {
           
            var modelResult = Mapper.Map<T,TK>(aEntity);

            return modelResult;
        }
  
  
        ///Created By: Carlos Raul (03102014)
        /// <summary>
        /// Extension Method to determine if a IEnumerable is Empty
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="ienumerable"></param>
        /// <returns></returns>
        public static bool IsEmpty<T>(this IEnumerable<T> ienumerable)
        {
            return !ienumerable.Any();
        }
  
    }
}