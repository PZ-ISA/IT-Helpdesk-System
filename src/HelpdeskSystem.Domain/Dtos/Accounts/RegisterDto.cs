namespace HelpdeskSystem.Domain.Dtos.Accounts;

public sealed record RegisterDto
{
    public required string Name { get; set; }
    public required string Surname { get; set; }
    public required string Email { get; set; }
    public string? Role { get; set; }
    public required string Password { get; set; }
    public required string ConfirmPassword { get; set; }
}