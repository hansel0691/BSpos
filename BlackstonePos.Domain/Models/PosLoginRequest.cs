using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlackstonePos.Domain.Models
{
    public class PosLoginRequest: PosCredentials
    {
        public string Password { get; set; }
    }
}
