namespace HelpdeskSystem.Domain.Dtos.Users;

public sealed record UserStatusDto
{
    public Guid Id { get; set; }
    public bool IsActive { get; set; }
}