using HelpdeskSystem.Domain.Common;

namespace HelpdeskSystem.Domain.Entities;

public sealed record Takeover : BaseEntity
{
    public required Guid AdminUserId { get; set; }
    public required Guid TicketId { get; set; }
    
    public User? AdminUser { get; set; }
    public Ticket? Ticket { get; set; }
}