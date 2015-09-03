using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlackstonePos.Domain.Models
{
    public class AchTransaction
    {
        public int Id { get; set; }
        public int? PaymentId { get; set; }
        public decimal? Amount { get; set; }
        public bool? Status { get; set; }
        public string Remarks { get; set; }
        public DateTime? TimeSpan { get; set; }
    }
}
