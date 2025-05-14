using HelpdeskSystem.Application.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace HelpdeskSystem.Application.Middleware;

public class ActiveUserAuthorizationHandler : AuthorizationHandler<ActiveUserRequirement>
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ActiveUserAuthorizationHandler(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, ActiveUserRequirement requirement)
    {
        var user = _httpContextAccessor.HttpContext?.User;
        var isActiveClaim = user?.FindFirst("IsActive");

        if (isActiveClaim != null && bool.TryParse(isActiveClaim.Value, out var isActive) && isActive)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}