using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlackstonePos.Data.Repositories
{
        public class ApplicantRepository : BaseRepository<Domain.Models.Applicant, Data.EFModels.Applicant>, Domain.Contracts.Repositories.IApplicantRepository
        {
            public ApplicantRepository()
            {
                _dbContext = new Data.EFModels.BlackstonePos_NewEntities();

                _dbSet = (_dbContext as Data.EFModels.BlackstonePos_NewEntities).Applicants;
            }

        }
}
