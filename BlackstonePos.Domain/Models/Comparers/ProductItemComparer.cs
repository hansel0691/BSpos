using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlackstonePos.Domain.Models.Comparers
{
    public class ProductItemComparer: IEqualityComparer<ProductItem>
    {

        public bool Equals(ProductItem x, ProductItem y)
        {
            return x.Code == y.Code;
        }

        public int GetHashCode(ProductItem obj)
        {
            return obj != null ? obj.GetHashCode() : 0;
        }
    }
}
