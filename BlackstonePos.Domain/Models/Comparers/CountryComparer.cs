using System.Collections.Generic;

namespace BlackstonePos.Domain.Models.Comparers
{
    public class CountryComparer: IEqualityComparer<Country>
    {
        public bool Equals(Country x, Country y)
        {
            return x.ShortCountryCode == y.ShortCountryCode;
        }

        public int GetHashCode(Country obj)
        {
            return obj.ShortCountryCode.GetHashCode();
        }
    }
}