namespace HelpdeskSystem.Domain.Interfaces;

public interface IAdminTicketTakeoverService
{
    Task GetActiveTakeoverRequestsAsync(CancellationToken ct);
    Task CreateTakeoverRequestAsync(Guid id, CancellationToken ct);
    Task DeleteTakeoverRequestAsync(Guid id, CancellationToken ct);
    
}