namespace HelpdeskSystem.Domain.Dtos.ExportData;

public sealed record ExportTicketDto
{
    public required Guid TicketId { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public ICollection<ExportTicketMessageDto>? Messages { get; set; }
}