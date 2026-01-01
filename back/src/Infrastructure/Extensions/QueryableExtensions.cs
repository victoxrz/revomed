using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Extensions;

public static class QueryableExtensions
{
    public static Task<TResult?> SingleOrDefaultAsync<TSource, TResult>(
        this IQueryable<TSource> queryable,
        System.Linq.Expressions.Expression<Func<TSource, TResult>> selector
    )
    {
        return queryable.Select(selector).SingleOrDefaultAsync();
    }
}
