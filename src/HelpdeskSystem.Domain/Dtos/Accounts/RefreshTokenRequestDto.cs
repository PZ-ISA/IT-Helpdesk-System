namespace HelpdeskSystem.Domain.Dtos.Accounts;

public sealed record RefreshTokenRequestDto
{
    public required string RefreshToken { get; init; }
}