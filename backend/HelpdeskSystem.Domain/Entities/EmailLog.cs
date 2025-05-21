using HelpdeskSystem.Domain.Common;

namespace HelpdeskSystem.Domain.Entities;

public sealed record EmailLog : BaseEntity
{
    public required string Title { get; set; }
    public required string Content { get; set; }
    public required string Email { get; set; }
    public bool IsSuccess { get; set; }
}
