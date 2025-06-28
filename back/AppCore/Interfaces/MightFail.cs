namespace AppCore.Interfaces;

public class MightFail<T>
{
    public readonly T Data = default!;
    public readonly string? Error;

    public MightFail(string error)
    {
        Error = error;
    }
    public MightFail(T data)
    {
        Data = data;
    }

    public bool IsSuccessful => Error == null;
}