using System.Security.Claims;

namespace HelpdeskSystem.Domain.Interfaces;

public interface IUserContextService
{
    ClaimsPrincipal? GetCurrentUser();
}