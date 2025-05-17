namespace HelpdeskSystem.Application.Common;

public sealed record JwtOptions
{
    public required string Secret { get; set; }
    public required string Issuer { get; set; }
    public required string Audience { get; set; }
}