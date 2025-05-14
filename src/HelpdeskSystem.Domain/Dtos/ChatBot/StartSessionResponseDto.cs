namespace HelpdeskSystem.Domain.Dtos.ChatBot;

public record StartSessionResponseDto : ChatBotMessageDto
{
    public required Guid SessionId { get; set; }
}