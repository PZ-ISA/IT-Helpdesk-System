using HelpdeskSystem.Domain.Common;

namespace HelpdeskSystem.Domain.Entities;

public sealed record RefreshToken : BaseEntity
{
    public required string Token { get; set; }
    public DateTimeOffset ExpiresAt { get; set; } = DateTimeOffset.UtcNow.AddDays(20);
    public bool IsRevoked { get; set; } = false;
    public required Guid UserId { get; set; }
    public User? User { get; set; }
}