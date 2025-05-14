namespace HelpdeskSystem.Domain.Dtos.ChatBot;

public record ChatBotMessageResponseDto
{
    public required Guid Id { get; set; }
    public required DateTimeOffset CreatedAt { get; set; }
    public required Guid ChatBotSessionId { get; set; }
    public required string Message { get; set; }
    public required bool IsUserMessage { get; set; }
}