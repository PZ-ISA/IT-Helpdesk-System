using HelpdeskSystem.Domain.Dtos.Account;

namespace HelpdeskSystem.Domain.Interfaces;

public interface IAccountService
{
    Task LoginAsync(LoginDto dto, CancellationToken ct);
}