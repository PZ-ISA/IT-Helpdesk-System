namespace HelpdeskSystem.Domain.Dtos.TicketMessages;

public sealed record TicketMessageDto()
{
    public required Guid Id { get; set; }
    public required string Message { get; set; }
    public required Guid UserId { get; set; }
    public required Guid TicketId { get; set; }
    public required DateTimeOffset CreatedAt { get; set; }
    public required DateTimeOffset UpdatedAt { get; set; }
    
}