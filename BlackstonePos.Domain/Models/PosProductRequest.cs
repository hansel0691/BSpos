using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlackstonePos.Domain.Models
{
    public class PosProductRequest: PosCredentials
    {
        public string ProductMainCode { get; set; }

        public string Category { get; set; }

        public string CountryCode { get; set; }

        public int CarrierId { get; set; }

        public int Amount { get; set; }
    }
}
