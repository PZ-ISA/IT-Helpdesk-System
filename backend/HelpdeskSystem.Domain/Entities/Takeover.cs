using HelpdeskSystem.Domain.Common;

namespace HelpdeskSystem.Domain.Entities;

public sealed record Takeover : BaseEntity
{
    public required Guid AdminUserId { get; set; }
}