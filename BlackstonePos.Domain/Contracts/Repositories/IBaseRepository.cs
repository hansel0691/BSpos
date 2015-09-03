using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlackstonePos.Domain.Contracts.Repositories
{
    public interface IBaseRepository<T>
    {
        T Add(T newEntity);
        
        T Get(int id);

        IEnumerable<T> Get(); 

        void Update(T entity);

        bool Delete(int id);

    }
}
