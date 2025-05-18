namespace HelpdeskSystem.Domain.Dtos.Users;

public sealed record UpdateUserStatusDto
{
    public required bool IsActive { get; init; }
}