using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BlackstonePos.Data.EFModels;
using BlackstonePos.Domain.Contracts.Repositories;

namespace BlackstonePos.Data.Repositories
{
    public class GuestRepository : BaseRepository<Domain.Models.Guest, Guest>, IGuestRepository
    {
        public GuestRepository()
        {
            _dbContext = new BlackstonePos_NewEntities();

            _dbSet = (_dbContext as BlackstonePos_NewEntities).Guests;
        }

        public override Domain.Models.Guest Add(Domain.Models.Guest newEntity)
        {
            newEntity.TimeStamp = DateTime.Now;
            
            return base.Add(newEntity);
        }
    }
}
