using System.Security.Claims;
using HelpdeskSystem.Domain.Interfaces;
using Microsoft.AspNetCore.Http;

namespace HelpdeskSystem.Application.Services;

public class UserContextService : IUserContextService
{
    private readonly IHttpContextAccessor _httpContext;
    
    public UserContextService(IHttpContextAccessor httpContext)
    {
        _httpContext = httpContext;
    }
    
    public ClaimsPrincipal? GetCurrentUser()
    {
        return _httpContext.HttpContext?.User;
    }
}