using HelpdeskSystem.Domain.Dtos.Accounts;

namespace HelpdeskSystem.Domain.Interfaces;

public interface IAccountService
{
    Task<string> LoginAsync(LoginDto dto, CancellationToken ct);
    Task RegisterAsync(RegisterDto dto, CancellationToken ct);
}