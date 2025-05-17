namespace HelpdeskSystem.Application.Common;

public sealed record ChatBotUser
{
    public required string Username { get; set; }
    public required string Password { get; set; }
}