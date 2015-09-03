using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BS.Services.com.blackstoneonline.services;

namespace OrdersGateway.Models
{
    public class BsPosProduct: ProductListItem
    {
        public string MainCategory { get; set; }
    }
}