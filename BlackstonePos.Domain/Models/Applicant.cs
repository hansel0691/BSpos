using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlackstonePos.Domain.Models
{
    public class Applicant: Guest
    {
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
    }
}
