using HelpdeskSystem.Domain.Interfaces;

namespace HelpdeskSystem.Application.Services;

public class AdminTicketTakeoverService : IAdminTicketTakeoverService
{
    public Task GetActiveTakeoverRequestsAsync(CancellationToken ct)
    {
        throw new NotImplementedException();
    }

    public Task CreateTakeoverRequestAsync(Guid id, CancellationToken ct)
    {
        throw new NotImplementedException();
    }

    public Task DeleteTakeoverRequestAsync(Guid id, CancellationToken ct)
    {
        throw new NotImplementedException();
    }
}