using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlackstonePos.Domain.Models
{
    public class FullCargaSmsTemplate
    {
        public int Id { get; set; }
        public string ProductCategory { get; set; }
        public string SmsTemplate { get; set; }
    }
}
