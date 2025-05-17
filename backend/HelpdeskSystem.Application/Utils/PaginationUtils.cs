namespace HelpdeskSystem.Application.Utils;

public static class PaginationUtils
{
    public static IQueryable<T> Paginate<T>(this IQueryable<T> source, int pageNumber, int pageSize)
    {
        return source
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize);
    }

    public static IEnumerable<T> Paginate<T>(this IEnumerable<T> source, int pageNumber, int pageSize)
    {
        return source
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize);
    }
}