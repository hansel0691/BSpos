using BlackstonePos.Domain.Contracts.Repositories;
using BlackstonePos.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace BlackstonePos.Data.Repositories
{
    public class FullCargaSmsTemplatesRepository: BaseRepository<FullCargaSmsTemplate, EFModels.FullCargaSmsTemplate>, IFullCargaSmsTemplatesRepository
    {
        public FullCargaSmsTemplatesRepository()
            {
                _dbContext = new EFModels.BlackstonePos_NewEntities();

                _dbSet = (_dbContext as EFModels.BlackstonePos_NewEntities).FullCargaSmsTemplates;
            }

        public string GetSmsTemplateFromCategory(string category)
        {
            var smsTemplate = _dbSet.FirstOrDefault(s => s.ProductCategory.Equals(category));

            return smsTemplate != null ? smsTemplate.SmsTemplate : string.Empty;
        }
    }
}
