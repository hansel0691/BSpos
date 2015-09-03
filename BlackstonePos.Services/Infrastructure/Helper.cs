using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using BlackstonePos.Domain.Models;
using BS.Services.com.blackstoneonline.services;
using Metele.common.Models;
using Metele.common.Models.PaxTerminal;

namespace BS.Services.Infrastructure
{
    public static class Helper
    {

        static Helper()
        {
            InitializeMaps();
        }

        private static void InitializeMaps()
        {

            Mapper.CreateMap<ProductListItem, ProductItem>()
            .ForMember(model => model.Denominations, entity => entity.MapFrom(p => p.Denominations as IEnumerable<double>))
            .ForMember(model => model.ShowAccessNumbers, entity => entity.MapFrom(p => p.Flags.ShowAccessPhones))
            .ForMember(model => model.ShowInstructions, entity => entity.MapFrom(p => p.Flags.ShowInstructions))
            .ForMember(model => model.ShowRates, entity => entity.MapFrom(p => p.Flags.ShowRates))
            .ForMember(model => model.ShowTerms, entity => entity.MapFrom(p => p.Flags.ShowTermsAndConditions))
            .ForMember(model => model.Fee, entity => entity.MapFrom(p => p.FeeAmount))
            .ForMember(model => model.IsTopUp, entity => entity.MapFrom(p=> p.IsTopUp()));

            Mapper.CreateMap<ProductDenominationConfig, DenominationsConfig>();

            Mapper.CreateMap<AccessPhone, AccessNumber>()
                .ForMember(model => model.AccessNum, entity => entity.MapFrom(p => p.Phone))
                .ForMember(model => model.City, entity => entity.MapFrom(p => p.City));

            Mapper.CreateMap<PIN, BrokerResponse>()
                .ForMember(model => model.LocalAccessPhones,
                entity => entity.MapFrom(p => p.LocalAccessPhones!= null? p.LocalAccessPhones.Select(a => a as AccessPhone): new List<AccessPhone>()))
                    .ForMember(model => model.CustomerService, entity => entity.MapFrom(p => p.CustomerServiceEnglish));

            Mapper.CreateMap<BlackstonePos.Domain.Models.Cashier, GiveCashier>()
                .ForMember(model => model.merchant_fk, entity => entity.MapFrom(p => p.MerchantId))
                .ForMember(model => model.mer_password, entity => entity.MapFrom(p => p.MerchantPassword))
                .ForMember(model => model.catalogTemp_fk, entity => entity.MapFrom(p => p.MerchantProfileID))
                .ForMember(model => model.terminal_id, entity => entity.MapFrom(p => p.MerchantTerminalID))
                .ForMember(model => model.operatorName, entity => entity.MapFrom(p => p.Name));


            //Mapper.CreateMap<PaxTerminalTransactionRequest, Order>()
            //    .ForMember(model => model.AccountNumber, entity => entity.MapFrom(p => p.AccountNumber))
            //    .ForMember(model => model., entity => entity.MapFrom(p => p.AddInfo1))
            //    .ForMember(model => model.AccountNumber, entity => entity.MapFrom(p => p.AccountNumber))
            //    .ForMember(model => model.AccountNumber, entity => entity.MapFrom(p => p.AccountNumber))
            //    .ForMember(model => model.AccountNumber, entity => entity.MapFrom(p => p.AccountNumber));

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

        public static TK MapTo<T, TK>(this T aEntity)
        {

            var modelResult = Mapper.Map<T, TK>(aEntity);

            return modelResult;
        }

        public static bool IsTopUp(this ProductListItem product)
        {
            var type = product.Type;

            return DomainCommonValues.TopUpKeyWords.Any(a => type.ToUpper().Contains(a.ToUpper())) 
                || DomainCommonValues.PinlessKeyWords.Any(a => type.ToUpper().Contains(a.ToUpper()));
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

                    var otherProperty = objectResult.GetType().GetProperties().FirstOrDefault(p=> p.Name == property.Name);

                    if (otherProperty != null && otherProperty.MemberType == property.MemberType)
                        otherProperty.SetValue(objectResult,propertyValue, null);
                }

                return objectResult;
            }
            catch (Exception exception)
            {

                return default(K);
            }
        }

        public static bool IsLike(this string str, string strOther)
        {
            const int fairDistance = 4;

            return str.IsLike(strOther, fairDistance);
        }

        public static string MostAlike(this string str, List<string> others)
        {
            others.Sort((a, b) =>
            {
                var strA = Distance(str, a);
                var strB = Distance(str, b);

                return strA.CompareTo(strB);
            });

            return others.FirstOrDefault();
        }


        public static bool IsLike(this string str, string strOther, int level)
        {
            var distance = Distance(str, strOther);

            return distance <= level;
        }

        private static int Distance(string a, string b)
        {
            int num3;
            int num = a.Length + 1;
            int num2 = b.Length + 1;
            int[,] numArray = new int[num, num2];
            for (num3 = 0; num3 < num; num3++)
            {
                numArray[num3, 0] = num3;
            }
            for (num3 = 0; num3 < num2; num3++)
            {
                numArray[0, num3] = num3;
            }
            for (num3 = 1; num3 < num; num3++)
            {
                for (int i = 1; i < num2; i++)
                {
                    numArray[num3, i] = (a[num3 - 1] == b[i - 1]) ? numArray[num3 - 1, i - 1] : Math.Min(numArray[num3 - 1, i] + 1, Math.Min((int)(numArray[num3, i - 1] + 1), (int)(numArray[num3 - 1, i - 1] + 1)));
                }
            }
            return numArray[num - 1, num2 - 1];
        }
    }
}
