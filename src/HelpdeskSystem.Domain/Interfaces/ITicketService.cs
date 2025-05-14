using HelpdeskSystem.Domain.Common;
using HelpdeskSystem.Domain.Dtos.Ticket;

namespace HelpdeskSystem.Domain.Interfaces;

public interface ITicketService
{
    Task<Guid> CreateTicketAsync(CreateTicketDto dto, CancellationToken ct);
    Task<TicketDto> GetTicketByIdAsync(Guid id, CancellationToken ct);
    Task<PaginatedResponseDto<TicketDto>> GetTicketsAsync(PageQueryFilterDto filterDto, CancellationToken ct);
    Task UpdateTicketAsync(CreateTicketDto dto, Guid id, CancellationToken ct);
    Task DeleteTicketAsync(Guid id, CancellationToken ct);
    // Task GetTicketMessagesAsync();
    // Task AddTicketMessageAsync();
}