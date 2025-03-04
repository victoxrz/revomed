using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppCore.Interfaces.Repository
{
    public interface IUserRepository
    {
        Task<bool> LoginAsync(string email, string password);
        Task<bool> SignupAsync(string email, string password);
    }
}
