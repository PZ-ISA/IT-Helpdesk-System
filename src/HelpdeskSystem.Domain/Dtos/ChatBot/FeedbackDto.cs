using HelpdeskSystem.Domain.Enums;

namespace HelpdeskSystem.Domain.Dtos.ChatBot;

public sealed record FeedbackDto
{
    public required Feedback Feedback { get; set; }
}