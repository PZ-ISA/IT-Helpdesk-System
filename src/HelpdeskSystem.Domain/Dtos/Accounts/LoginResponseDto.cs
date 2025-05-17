namespace HelpdeskSystem.Domain.Dtos.Accounts;

public sealed record LoginResponseDto
{
    public required string Token { get; init; }
    public required string RefreshToken { get; init; }
}