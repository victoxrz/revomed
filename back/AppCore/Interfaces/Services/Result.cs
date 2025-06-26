using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppCore.Interfaces.Services;

// TODO: move from here, rename in something that suggests that the current operation might return some errors
public class Result<T>
{
    public readonly T Data = default!;
    public readonly string? Error;

    public Result(string error)
    {
        Error = error;
    }
    public Result(T data)
    {
        Data = data;
    }

    public bool IsSuccessful => Error == null;
}