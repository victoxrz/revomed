namespace Infrastructure.Identity;
public record HashSettings(int HashSize, int SaltSize, int Iterations, int DegreeOfParallelism, int MemorySize);
