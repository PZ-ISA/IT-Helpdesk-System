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

    public Guid? GetCurrentUserId()
    {
        var userId = _httpContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

        if(!Guid.TryParse(userId, out var id))
        {
            return null;
        }
        
        return id;
    }
}