using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BlackstonePos.Data.EFModels;
using BlackstonePos.Data.Infrastructure;
using BlackstonePos.Domain.Contracts.Repositories;
using BlackstonePos.Domain.Models;
using Metele.common.Contracts.Repositories;

namespace BlackstonePos.Data.Repositories
{
    public class MerchantsRepository: IPosMerchantHeader
    {
        private readonly pin_dataEntities _pinDataEntities;
        private readonly BlackstonePos_NewEntities _blackstonePosNewEntities;

        public MerchantsRepository()
        {
            _pinDataEntities = new pin_dataEntities();
            _blackstonePosNewEntities = new BlackstonePos_NewEntities();
        }

        public Domain.Models.Cashier FindGlobalMerchant(int merchantId)
        {
            var merchantsInBlackstonePos = _blackstonePosNewEntities.view_cashiers;

            var cashier = merchantsInBlackstonePos.FirstOrDefault(c => c.MerchantId == merchantId);

            if (cashier != null)
            {
                var cashierResult = cashier.MapTo<view_cashiers, Domain.Models.Cashier>();

                return cashierResult;
            }

            var merchantHeaderInfo = _pinDataEntities.PosmerchantHeaders.FirstOrDefault(m=> m.merchant_pk == merchantId);
            var posMerchantTerminalInfo = _pinDataEntities.Posterminals.FirstOrDefault(t=> t.merchant_fk == merchantId);

            var globalCashierResult = new Domain.Models.Cashier
            {
                Id = merchantId,
                IsMerchant = true,
                Status = true,
                Name = "Manager",
                MerchantId = merchantId,
                MerchantPassword = merchantHeaderInfo.mer_password,
                MerchantProfileID = merchantHeaderInfo.catalogTemp_fk,
                MerchantTerminalID = posMerchantTerminalInfo.terminal_pk,
                Password = merchantHeaderInfo.mer_password,
                TimeStamp = DateTime.Now,
                DailyCreditLimit = merchantHeaderInfo.DailyLimit.HasValue ? merchantHeaderInfo.DailyLimit.Value : 0,
                WeeklyCreditLimit = merchantHeaderInfo.CreditLimit,
                WeeklyBalance = merchantHeaderInfo.CreditLimit - merchantHeaderInfo.CurrentBalance
            };

            return globalCashierResult;
        }
    }
}
