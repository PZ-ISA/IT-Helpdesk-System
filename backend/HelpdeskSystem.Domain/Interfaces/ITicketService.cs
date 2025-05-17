using HelpdeskSystem.Domain.Common;
using HelpdeskSystem.Domain.Dtos.Common;
using HelpdeskSystem.Domain.Dtos.Tickets;

namespace HelpdeskSystem.Domain.Interfaces;

public interface ITicketService
{
    Task<Guid> CreateTicketAsync(CreateTicketDto dto, CancellationToken ct);
    Task<TicketDto> GetTicketByIdAsync(Guid id, CancellationToken ct);
    Task<PaginatedResponseDto<TicketDto>> GetTicketsAsync(PageQueryFilterDto filterDto, CancellationToken ct);
    Task UpdateTicketAsync(CreateTicketDto dto, Guid id, CancellationToken ct);
    Task DeleteTicketAsync(Guid id, CancellationToken ct);
    Task AddFeedbackAsync(Guid id, FeedbackDto dto, CancellationToken ct);
}