namespace HelpdeskSystem.Domain.Common;

public record PageQueryFilterDto
{
    public int PageSize { get; set; }
    public int PageNumber { get; set; }
}