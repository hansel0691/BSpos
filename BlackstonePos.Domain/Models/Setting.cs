

using System;

namespace BlackstonePos.Domain.Models
{
    public class Setting: PosCredentials
    {
        public bool ConfirmPhone { get; set; }
        public decimal Tax { get; set; }
        public bool SmallReceipt { get; set; }
        public bool PaxTerminalAsPrinter { get; set; }
    }
}
