using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BlackstonePos.Data.EFModels;
using BlackstonePos.Domain.Contracts.Repositories;

namespace BlackstonePos.Data.Repositories
{
    public class AchTransactionRespository : BaseRepository<Domain.Models.AchTransaction, AchTransaction>, IAchTransactionRepository
    {
        public AchTransactionRespository()
        {
            _dbContext = new BlackstonePos_NewEntities();

            _dbSet = (_dbContext as BlackstonePos_NewEntities).AchTransactions;
        }

    }
}
