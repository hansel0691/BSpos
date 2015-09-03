using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BlackstonePos.Data.EFModels;
using BlackstonePos.Domain.Contracts.Repositories;

namespace BlackstonePos.Data.Repositories
{
    public class BsPromotionsRepository: BaseRepository<BlackstonePos.Domain.Models.Promotion, BlackstonePos.Data.EFModels.Promotion>,  BlackstonePos.Domain.Contracts.Repositories.IPromotionsRepository
    {
          public BsPromotionsRepository()
        {
            _dbContext = new BlackstonePos_Entities();

            _dbSet = (_dbContext as BlackstonePos_Entities).Promotions;
        }
    }
}
