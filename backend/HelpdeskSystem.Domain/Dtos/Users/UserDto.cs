namespace HelpdeskSystem.Domain.Dtos.Users;

public sealed record UserDto
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Surname { get; set; }
    public required string Email { get; set; }
    public required bool IsActive { get; set; }
}