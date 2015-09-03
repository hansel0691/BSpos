using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlackstonePos.Domain.Models
{
    public class EntityBase
    {
        public DateTime TimeStamp { get; set; }

        public bool Status { get; set; }
    }
}
