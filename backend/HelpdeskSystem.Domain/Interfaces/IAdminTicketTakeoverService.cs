using HelpdeskSystem.Domain.Common;
using HelpdeskSystem.Domain.Dtos.Takeover;

namespace HelpdeskSystem.Domain.Interfaces;

public interface IAdminTicketTakeoverService
{
    Task<PaginatedResponseDto<TakeoverDto>> GetIncomingTakeoversAsync(PageQueryFilterDto filterDto, CancellationToken ct);
    Task<PaginatedResponseDto<TakeoverDto>> GetOutgoingTakeoversAsync(PageQueryFilterDto filterDto, CancellationToken ct);
    Task DecideOnTakeoverRequestAsync(Guid takeoverId, TakeoverDecisionDto takeoverDecision, CancellationToken ct);
    Task CreateTakeoverRequestAsync(Guid id, CancellationToken ct);
    Task DeleteTakeoverRequestAsync(Guid id, CancellationToken ct);
}