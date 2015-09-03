using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Metele.data;

namespace OrdersGateway.Models.Comparers
{
    public class CountryComparer: IEqualityComparer<country>
    {
        public bool Equals(country x, country y)
        {
            return x.country_code == y.country_code;
        }

        public int GetHashCode(country obj)
        {
            return obj.country_code.GetHashCode();
        }
    }
}