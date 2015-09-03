using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BlackstonePos.Domain.Models;
using Metele.common.Models;
using Cashier = BlackstonePos.Domain.Models.Cashier;

namespace BlackstonePos.Domain.Contracts.Repositories
{
    public interface ICashierRepository: IBaseRepository<Cashier>
    {
        Cashier FindCashier(int merchantId, string password);
        Cashier FindMerchant(int merchantId);
        bool IsBlackstonePosMerchant(int merchantId);
    }
}
