using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using BlackstonePos.Domain.Models;

namespace BlackstonePos.Domain.Contracts.Repositories
{
    public interface IAppLogoRepository: IBaseRepository<AppLogoUrl>
    {
        AppLogoUrl GetAppLogoByBrandKey(string brandKey);
    }
}
