using HelpdeskSystem.Domain.Enums;

namespace HelpdeskSystem.Domain.Dtos.Tickets;

public sealed record TicketDto
{
    public required Guid Id { get; set; }
    public required DateTimeOffset CreatedAt { get; set; }
    public required DateTimeOffset UpdatedAt { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required  TicketStatus Status { get; set; }
    public Feedback? Feedback { get; set; }
    public required  Guid EmployeeUserId { get; set; }
    public Guid? AdminUserId { get; set; } 
}