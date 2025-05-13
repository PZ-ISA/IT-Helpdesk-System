using HelpdeskSystem.Domain.Enums;

namespace HelpdeskSystem.Domain.Dtos.ChatBot;

public sealed record ChatBotSessionDto
{
    public required Guid Id { get; set; }
    public required string Title { get; set; }
    public required DateTimeOffset CreatedAt { get; set; }
    public required DateTimeOffset UpdatedAt { get; set; }
    public DateTimeOffset? EndDate { get; set; }
    public Feedback? Feedback { get; set; }
    public Guid UserId { get; set; }
}