using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlackstonePos.Domain.Models.Comparers
{
    public class InitialComparer: IEqualityComparer<Initial>
    {
        public bool Equals(Initial x, Initial y)
        {
            return x.Char.Equals(y.Char);
        }

        public int GetHashCode(Initial obj)
        {
            return obj.Char.GetHashCode();
        }
    }
}
