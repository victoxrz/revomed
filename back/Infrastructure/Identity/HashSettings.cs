using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Identity;
public record HashSettings(int HashSize, int SaltSize, int Iterations, int DegreeOfParallelism, int MemorySize);
