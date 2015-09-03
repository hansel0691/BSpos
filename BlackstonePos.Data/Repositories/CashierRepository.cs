using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BlackstonePos.Data.EFModels;
using BlackstonePos.Data.Infrastructure;
using BlackstonePos.Domain.Contracts.Repositories;

namespace BlackstonePos.Data.Repositories
{
    public class CashierRepository : BaseRepository<Domain.Models.Cashier, Cashier>, ICashierRepository
    {
        public CashierRepository()
        {
            _dbContext = new BlackstonePos_NewEntities();

            _dbSet = (_dbContext as BlackstonePos_NewEntities).Cashiers;
        }

        public Domain.Models.Cashier FindCashier(int merchantId, string password)
        {
            var cashier = (_dbContext as BlackstonePos_NewEntities).view_cashiers.FirstOrDefault(c => c.MerchantId == merchantId && c.Password == password);

            var cashierResult = cashier.MapTo<view_cashiers, Domain.Models.Cashier>();

            return cashierResult;
        }

        public override Domain.Models.Cashier Add(Domain.Models.Cashier newEntity)
        {
            newEntity.TimeStamp = DateTime.Now;
            newEntity.Status = true;
            newEntity.IsMerchant = false;
            return base.Add(newEntity);
        }

        public override void Update(Domain.Models.Cashier entity)
        {
            var oldCashier = base.Get(entity.Id);

            entity.MerchantId = oldCashier.MerchantId;
            entity.TimeStamp = oldCashier.TimeStamp;
            entity.IsMerchant = false;

            base.Update(entity);
        }

        public bool IsBlackstonePosMerchant(int merchantId)
        {
            var cashier = (_dbContext as BlackstonePos_NewEntities).view_cashiers.FirstOrDefault(c => c.MerchantId == merchantId);

            return cashier != null;
        }

        public Domain.Models.Cashier FindMerchant(int merchantId)
        {
            var cashier = (_dbContext as BlackstonePos_NewEntities).view_cashiers.FirstOrDefault(c => c.MerchantId == merchantId);

            var cashierResult = cashier.MapTo<view_cashiers, Domain.Models.Cashier>();

            return cashierResult;
        }
    }
}
