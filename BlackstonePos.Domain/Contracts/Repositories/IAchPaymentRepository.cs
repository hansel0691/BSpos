using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BlackstonePos.Domain.Models;

namespace BlackstonePos.Domain.Contracts.Repositories
{
    public interface IAchPaymentRepository: IBaseRepository<AchPayment>
    {
        int FindPayment(string accountNumber, string routingNumber);

        IEnumerable<AchPayment> GetAchSavedPayments(string merchantId);
    }
}
