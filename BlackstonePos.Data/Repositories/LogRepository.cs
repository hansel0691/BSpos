using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BlackstonePos.Data.EFModels;
using BlackstonePos.Domain.Contracts.Repositories;
using Log = BlackstonePos.Domain.Models.Log;

namespace BlackstonePos.Data.Repositories
{
    public class LogRepository: BaseRepository<Log, EFModels.Log>, ILogRepository
    {
        public LogRepository()
        {
            _dbContext = new BlackstonePos_NewEntities();

            _dbSet = (_dbContext as BlackstonePos_NewEntities).Logs;
        }


    }
}
