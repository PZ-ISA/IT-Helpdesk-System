namespace HelpdeskSystem.Domain.Dtos.Users;

public sealed record UpdateUserDto
{
    public required string Name { get; set; }
    public required string Surname { get; set; }
    public required string Email { get; set; }
}