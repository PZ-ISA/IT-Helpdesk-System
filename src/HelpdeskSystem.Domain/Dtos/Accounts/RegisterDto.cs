namespace HelpdeskSystem.Domain.Dtos.Accounts;

public sealed record RegisterDto
{
    public required string Name { get; init; }
    public required string Surname { get; init; }
    public required string Email { get; init; }
    public string? Role { get; init; }
    public required string Password { get; init; }
    public required string ConfirmPassword { get; init; }
}