using HelpdeskSystem.Domain.Dtos.TicketMessages;
using HelpdeskSystem.Domain.Entities;

namespace HelpdeskSystem.Application.Mappers;

public static class TicketMessageMappers
{
    public static TicketMessageDto MapToTicketMessageDto(TicketMessage ticketMessage)
    {
        var ticketMessageDto = new TicketMessageDto
        {
            Id = ticketMessage.Id,
            Message = ticketMessage.Message,
            UserId = ticketMessage.UserId,
            TicketId = ticketMessage.TicketId,
            CreatedAt = ticketMessage.CreatedAt,
            UpdatedAt = ticketMessage.UpdatedAt
        };
        
        return ticketMessageDto;
    }
}