using HelpdeskSystem.Domain.Dtos.TicketMessages;
using HelpdeskSystem.Domain.Entities;

namespace HelpdeskSystem.Application.Mappers;

public static class TicketMessageMappers
{
    public static TicketMessageDto MapToTicketMessageDto(TicketMessage ticketMessage)
    {
        var ticketMessageDto = new TicketMessageDto
        {
            Message = ticketMessage.Message,
            UserId = ticketMessage.UserId,
            CreatedAt = ticketMessage.CreatedAt
        };
        
        return ticketMessageDto;
    }
}