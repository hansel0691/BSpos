using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using Metele.common.Models;

namespace BlackstonePos.Domain.Models.Comparers
{
    public class CarrierComparer: IEqualityComparer<Carrier>
    {
        public bool Equals(Carrier x, Carrier y)
        {
            return x.CarrierId.Equals(y.CarrierId);
        }

        public int GetHashCode(Carrier obj)
        {
            return obj.CarrierId.GetHashCode();
        }
    }
}
