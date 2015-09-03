using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlackstonePos.Domain.Contracts.Repositories
{
    public interface IPromotionsRepository
    {
        IEnumerable<Models.Promotion> GetAllPromotions();

        IEnumerable<string> GetActivePosProducts(int merchantId);

    }
}
