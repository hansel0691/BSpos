using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BlackstonePos.Data.EFModels;
using BlackstonePos.Domain.Contracts.Repositories;
using Setting = BlackstonePos.Domain.Models.Setting;

namespace BlackstonePos.Data.Repositories
{
    public class SettingsRepository: BaseRepository<Setting, EFModels.Setting>, ISettingRepository
    {
        public SettingsRepository()
        {
            _dbContext = new BlackstonePos_NewEntities();

            _dbSet = (_dbContext as BlackstonePos_NewEntities).Settings;
        }
    }
}
