using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlackstonePos.Domain.Exceptions
{
    public class UnAuthorizedException: Exception
    {
        public override string Message
        {
            get { return "UnAuthorized Operation"; }
        }
    }
}
