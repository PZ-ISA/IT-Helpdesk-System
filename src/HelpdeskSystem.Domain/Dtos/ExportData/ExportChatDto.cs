namespace HelpdeskSystem.Domain.Dtos.ExportData;

public sealed record ExportChatDto
{
    public required Guid Id { get; set; }
    public required string Title { get; set; }
    public required string Feedback { get; set; }
    public required DateTimeOffset CreatedAt { get; set; }
    public ICollection<ExportChatMessageDto>? Messages { get; set; }
}