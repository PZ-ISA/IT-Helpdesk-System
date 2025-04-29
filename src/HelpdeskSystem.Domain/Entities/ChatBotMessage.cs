using HelpdeskSystem.Domain.Common;

namespace HelpdeskSystem.Domain.Entities;

public sealed record ChatBotMessage : BaseEntity
{
    public required string Content { get; set; }
    public bool IsUserMessage { get; set; }
    public Guid ChatBotSessionId { get; set; }

    public ChatBotSession? ChatBotSession { get; set; }
}