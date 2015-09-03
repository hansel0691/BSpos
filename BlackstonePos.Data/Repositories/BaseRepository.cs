using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BlackstonePos.Data.EFModels;
using BlackstonePos.Data.Infrastructure;
using BlackstonePos.Domain.Contracts.Repositories;
using BlackstonePos.Domain.Models;
using Metele.common.Contracts.Repositories;
using Metele.common.Models;
using Order = BlackstonePos.Domain.Models.Order;

namespace BlackstonePos.Data.Repositories
{
    public abstract class BaseRepository<T, K> : IBaseRepository<T> where K: class
    {
        protected DbContext _dbContext;
        
        protected DbSet<K> _dbSet;

        protected BaseRepository()
        {
        }

        protected BaseRepository(DbSet<K> dbSet)
        {
            _dbSet = dbSet;
        }

        public virtual T Add(T newEntity)
        {
            var orderEntity = newEntity.SingleMapTo<T, K>();

            var orderResult = _dbSet.Add(orderEntity);

            _dbContext.SaveChanges();

            var orderDomain = orderResult.SingleMapTo<K, T>();

            return orderDomain;
        }

        public virtual T Get(int id)
        {
            var entity = _dbSet.Find(id);

            var result = entity.SingleMapTo<K, T>();

            return result;
        }

        public virtual IEnumerable<T> Get()
        {
            var entities = _dbSet as IEnumerable<K>;

            var domainResult = entities.MultipleMapTo<K, T>();

            return domainResult; 
        }

        public virtual void Update(T entity)
        {
            var itemToUpdate = entity.SingleMapTo<T, K>();

            _dbSet.AddOrUpdate(itemToUpdate);

            _dbContext.SaveChanges();
        }

        public bool Delete(int id)
        {
            var itemToDelete = _dbSet.Find(id);

            var removed = _dbSet.Remove(itemToDelete);

            _dbContext.SaveChanges();

            return removed != null;
        }
    }
}
