using HelpdeskSystem.Domain.Common;
using HelpdeskSystem.Domain.Dtos.Tickets;
using HelpdeskSystem.Domain.Enums;

namespace HelpdeskSystem.Domain.Interfaces;

public interface IAdminTicketService
{
    
    Task<PaginatedResponseDto<TicketDto>> GetTicketsAsync(PageQueryFilterDto filterDto, TicketStatus status, CancellationToken ct);
    Task<TicketDto> GetTicketByIdAsync(Guid id, CancellationToken ct);
    Task UpdateTicketEmployeeAsync(UpdateTicketEmployeeDto updateTicketEmployeeDto, Guid id, CancellationToken ct);
}