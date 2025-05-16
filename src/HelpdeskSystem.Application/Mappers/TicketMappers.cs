using HelpdeskSystem.Domain.Dtos.Ticket;
using HelpdeskSystem.Domain.Entities;

namespace HelpdeskSystem.Application.Mappers;

public static class TicketMappers
{
    public static TicketDto MapToTicketDto(Ticket ticket)
    {
        var ticketDto = new TicketDto
        {
            Id = ticket.Id,
            CreatedAt = ticket.CreatedAt,
            UpdatedAt = ticket.UpdatedAt,
            Status = ticket.Status,
            Title = ticket.Title,
            Description = ticket.Description,
            EmployeeUserId = ticket.EmployeeUserId,
            AdminUserId = ticket.AdminUserId,
        };
        
        return ticketDto;
    }
}