using HelpdeskSystem.Domain.Common;
using HelpdeskSystem.Domain.Dtos.TicketMessages;

namespace HelpdeskSystem.Domain.Interfaces;

public interface ITicketMessageService
{
    Task<PaginatedResponseDto<TicketMessageDto>> GetTicketMessagesAsync(PageQueryFilterDto filterDto, Guid ticketId, CancellationToken ct);
    Task CreateTicketMessageAsync(CreateTicketMessageDto createTicketMessageDto, Guid ticketId, CancellationToken ct);
}