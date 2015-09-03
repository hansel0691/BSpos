using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BlackstonePos.Data.EFModels;
using BlackstonePos.Data.Infrastructure;
using BlackstonePos.Domain.Contracts.Repositories;
using AppLogoUrl = BlackstonePos.Domain.Models.AppLogoUrl;

namespace BlackstonePos.Data.Repositories
{
    public class AppLogoRepository: BaseRepository<AppLogoUrl, EFModels.AppLogoUrl>, IAppLogoRepository
    {
        public AppLogoRepository()
        {
            _dbContext = new BlackstonePos_NewEntities();

            _dbSet = (_dbContext as BlackstonePos_NewEntities).AppLogoUrls;
        }

        public AppLogoUrl GetAppLogoByBrandKey(string brandKey)
        {
            var appLogoUrl = _dbSet.FirstOrDefault(app => app.BrandKey.Equals(brandKey));

            var result = appLogoUrl.MapTo<EFModels.AppLogoUrl, AppLogoUrl>();

            return result;
        }
    }
}
