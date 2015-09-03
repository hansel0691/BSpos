using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlackstonePos.Domain.Models.Comparers
{
    public class CashierComparer: IEqualityComparer<Cashier>
    {
        public bool Equals(Cashier x, Cashier y)
        {
            return x.Name.Equals(y.Name);
        }

        public int GetHashCode(Cashier obj)
        {
            return obj.GetHashCode();
        }
    }
}
