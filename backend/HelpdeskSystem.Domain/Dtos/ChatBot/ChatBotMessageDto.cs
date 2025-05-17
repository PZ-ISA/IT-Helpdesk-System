namespace HelpdeskSystem.Domain.Dtos.ChatBot;

public record ChatBotMessageDto
{
    public required string Message { get; init; }
    public required DateTimeOffset Date { get; init; }
}