using HelpdeskSystem.Domain.Dtos.Takeover;
using HelpdeskSystem.Domain.Dtos.Tickets;
using HelpdeskSystem.Domain.Entities;

namespace HelpdeskSystem.Application.Mappers;

public static class TakeoverMappers
{
    public static TakeoverDto MapToTakeoverDto(Takeover takeover)
    {
        var takeoverDto = new TakeoverDto
        {
            Id = takeover.Id,
            AdminUserId = takeover.AdminUserId,
            TicketId = takeover.TicketId,
            CreatedAt = takeover.CreatedAt,
            UpdatedAt = takeover.UpdatedAt,
        };
        
        return takeoverDto;
    }
}