namespace HelpdeskSystem.Domain.Dtos.Tickets;

public sealed record CreateTicketDto
{
    public required string Title { get; set; }
    public required string Description { get; set; }
}