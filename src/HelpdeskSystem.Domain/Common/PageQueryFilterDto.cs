namespace HelpdeskSystem.Domain.Common;

public record PageQueryFilterDto
{
    public int PageSize { get; set; } = 10;
    public int PageNumber { get; set; } = 1;
}