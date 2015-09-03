using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using System.Security.Cryptography.Pkcs;
using BlackstonePos.Data.EFModels;
using BlackstonePos.Domain.Models;
using Metele.common.Models.PaxTerminal;
using AchPayment = BlackstonePos.Data.EFModels.AchPayment;
using AppLogoUrl = BlackstonePos.Domain.Models.AppLogoUrl;
using Cashier = BlackstonePos.Domain.Models.Cashier;

namespace BlackstonePos.Data.Infrastructure
{
    public static class Helper
    {

        static Helper()
        {
            InitMaps();
        }

        private static void InitMaps()
        {
            #region Cashier Map

            Mapper.CreateMap<AchPayment, Domain.Models.AchPayment>()
            .ForMember(model => model.AccountNumber, entity => entity.MapFrom(p => p.AccountNumber))
            .ForMember(model => model.Id, entity => entity.MapFrom(p => p.Id))
            .ForMember(model => model.MerchantId, entity => entity.MapFrom(p => int.Parse(p.MerchantId)))
            .ForMember(model => model.RoutingNumber, entity => entity.MapFrom(p => p.RoutingNumber))
            .ForMember(model => model.Saved, entity => entity.MapFrom(p => p.Saved))
            .ForMember(model => model.TimeStamp, entity => entity.MapFrom(p => p.TimeStamp));

            Mapper.CreateMap<PosBillPaymentRequest, Domain.Models.Order>()
                .ForMember(model => model.AccountNumber, entity => entity.MapFrom(p => p.AccountNumber))
                .ForMember(model => model.MerchantId, entity => entity.MapFrom(p => p.MerchantId))
                .ForMember(model => model.Amount, entity => entity.MapFrom(p => Convert.ToDecimal(p.Amount)))
                .ForMember(model => model.BillerId, entity => entity.MapFrom(p => p.BillerId));


            Mapper.CreateMap<PosmerchantHeader, PosMerchantHeader>();
            Mapper.CreateMap<PosMerchantHeader, PosmerchantHeader>();
              
            Mapper.CreateMap<Domain.Models.AchPayment, AchPayment>();

            Mapper.CreateMap<PaxTerminalTransactionRequest, PaxPosOrderRequest>();

            Mapper.CreateMap<PaxPosOrderRequest, PaxTerminalTransactionRequest>();

            Mapper.CreateMap<view_cashiers, Cashier>()
           .ForMember(model => model.IsFullCarga, entity => entity.MapFrom(p => p.isFullcarga.HasValue && p.isFullcarga.Value == 1));
            
            Mapper.CreateMap<Cashier, view_cashiers>()
                .ForMember(model => model.isFullcarga, entity => entity.MapFrom(p => p.IsFullCarga? 1 : 0));

            Mapper.CreateMap<PosRequest, Domain.Models.Order>()
                .ForMember(model => model.MerchantId, entity => entity.MapFrom(p => p.MerchantId))
                .ForMember(model => model.Amount, entity => entity.MapFrom(p => p.Amount))
                .ForMember(model => model.ProductMainCode, entity => entity.MapFrom(p => p.ProductMainCode))
                .ForMember(model => model.CountryCode, entity => entity.MapFrom(p => p.CountryCode))
                .ForMember(model => model.TimeStamp, entity => entity.MapFrom(p => DateTime.Now))
                .ForMember(model => model.Status, entity => entity.MapFrom(p => false));

            #endregion

            #region AppLogoUrl
            Mapper.CreateMap<AppLogoUrl, EFModels.AppLogoUrl>();
            Mapper.CreateMap<EFModels.AppLogoUrl, AppLogoUrl>();
            #endregion

        }

        public static TK MapTo<T, TK>(this T aEntity)
        {
            var modelResult = Mapper.Map<T, TK>(aEntity);

            return modelResult;
        }

        public static K SingleMapTo<T, K>(this T amodelSource)
        {
            var modelResult = SingleMap<T, K>(amodelSource);

            return modelResult;
        }


        public static IEnumerable<K> MultipleMapTo<T, K>(this IEnumerable<T> items)
        {
            return items.Select(item => item.SingleMap<T, K>()).ToList();
        }

        private static K SingleMap<T, K>(this T item)
        {
            try
            {
                var objectResult = Activator.CreateInstance<K>();

                var myType = typeof(T);

                var myTypeProperties = myType.GetProperties();

                foreach (var property in myTypeProperties)
                {
                    var propertyValue = property.GetValue(item, null);

                    var otherProperty = objectResult.GetType().GetProperties().FirstOrDefault(p=> p.Name.ToUpper() == property.Name.ToUpper());

                    if (otherProperty != null)
                        otherProperty.SetValue(objectResult,propertyValue, null);
                }

                return objectResult;
            }
            catch (Exception exception)
            {

                return default(K);
            }
        }


    }
}
