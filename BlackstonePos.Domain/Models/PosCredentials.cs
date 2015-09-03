using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlackstonePos.Domain.Models
{
    public class PosCredentials
    {
        public int MerchantId { get; set; }

        public string MerchantPassword { get; set; }
    }
}
