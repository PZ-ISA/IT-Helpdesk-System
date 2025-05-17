using HelpdeskSystem.Domain.Enums;

namespace HelpdeskSystem.Domain.Dtos.Common;

public sealed record FeedbackDto
{
    public required Feedback Feedback { get; set; }
}