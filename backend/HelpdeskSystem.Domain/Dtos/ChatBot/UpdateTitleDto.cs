namespace HelpdeskSystem.Domain.Dtos.ChatBot;

public sealed record UpdateTitleDto
{
    public required string Title { get; init; }
}