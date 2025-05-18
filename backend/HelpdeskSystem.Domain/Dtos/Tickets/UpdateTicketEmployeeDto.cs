namespace HelpdeskSystem.Domain.Dtos.Tickets;

public record UpdateTicketEmployeeDto()
{
    public required  Guid EmployeeUserId { get; set; }
}