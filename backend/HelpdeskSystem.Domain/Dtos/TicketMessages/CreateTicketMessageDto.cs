namespace HelpdeskSystem.Domain.Dtos.TicketMessages;

public sealed record CreateTicketMessageDto
{
    public required string Message { get; set; }
}