namespace HelpdeskSystem.Domain.Dtos.Accounts;

public class LoginResponseDto
{
    public required string Token { get; init; }
    public required string RefreshToken { get; init; }
}