using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlackstonePos.Domain.Models
{
    public class ApiClient
    {
        public int Id { get; set; }

        public string OperationName { get; set; }

        public string DataBaseName { get; set; }

        public string DataBaseUserName { get; set; }

        public string DataBasePassword { get; set; }

        public string DataBaseCatalog { get; set; }
    }
}
