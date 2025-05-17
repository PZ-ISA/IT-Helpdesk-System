namespace HelpdeskSystem.Domain.Dtos.ExportData;

public sealed record ExportTicketMessageDto
{
    public required string Sender { get; set; }
    public required string Message { get; set; }
    public required DateTimeOffset CreatedAt { get; set; }
}