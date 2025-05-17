namespace HelpdeskSystem.Domain.Dtos.ExportData;

public sealed record ExportChatMessageDto
{
    public required bool IsUserMessage { get; set; }
    public required string Message { get; set; }
    public required DateTimeOffset CreatedAt { get; set; }
}