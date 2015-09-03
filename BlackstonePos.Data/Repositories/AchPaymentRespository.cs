using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BlackstonePos.Data.EFModels;
using BlackstonePos.Data.Infrastructure;
using BlackstonePos.Domain.Contracts.Repositories;

namespace BlackstonePos.Data.Repositories
{
    public class AchPaymentRespository: BaseRepository<Domain.Models.AchPayment, AchPayment>, IAchPaymentRepository
    {
        public AchPaymentRespository()
        {
            _dbContext = new BlackstonePos_NewEntities();

            _dbSet = (_dbContext as BlackstonePos_NewEntities).AchPayments;
        }

        public int FindPayment(string accountNumber, string routingNumber)
        {
            var searchResult = _dbSet.FirstOrDefault(ach => ach.AccountNumber == accountNumber && ach.RoutingNumber == routingNumber);

            return searchResult != null ? searchResult.Id : 0;
        }

        public IEnumerable<Domain.Models.AchPayment> GetAchSavedPayments(string merchantId)
        {
            var merchantSavedPayments = _dbSet.Where(payment => payment.MerchantId == merchantId && payment.Saved.HasValue && payment.Saved.Value);

            var merchantSavedPaymentResults = merchantSavedPayments.MapTo<IEnumerable<AchPayment>, IEnumerable<Domain.Models.AchPayment>>();

            return merchantSavedPaymentResults;
        }

        public override Domain.Models.AchPayment Add(Domain.Models.AchPayment newEntity)
        {

            var searchResult = _dbSet.Find(newEntity.Id);

            if (searchResult != null)
                return newEntity;
                //return UpdateAchPayment(newEntity);
                

            var orderEntity = newEntity.SingleMapTo<Domain.Models.AchPayment, AchPayment>();
            
            var orderResult  =_dbSet.Add(orderEntity);

            _dbContext.SaveChanges();

             var orderDomain = orderResult.SingleMapTo<AchPayment, Domain.Models.AchPayment>();

            return orderDomain;
        }

        private Domain.Models.AchPayment UpdateAchPayment(Domain.Models.AchPayment newEntity)
        {
            var entity = newEntity.SingleMapTo<Domain.Models.AchPayment, AchPayment>();
            _dbSet.AddOrUpdate(entity);
            _dbContext.SaveChanges();
            return newEntity;
        }
    }
}
