using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlackstonePos.Domain.Models
{
    public enum RequestStatus
    {
        Ok = 200, KnownErrors = 201, Exception = 202, PaxTerminal = 203
    }
}
