using HelpdeskSystem.Application.Common;
using Microsoft.AspNetCore.Authorization;

namespace HelpdeskSystem.API.Extensions;

public static class AuthorizationExtensions
{
    public static void AddAuthorizationPolicies(this AuthorizationOptions options)
    {
        options.AddPolicy("Employee", policy => policy.RequireRole("Employee"));
        options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
        options.AddPolicy("ChatBot", policy => policy.RequireRole("ChatBot"));
        options.AddPolicy("IsActive", policy => policy.AddRequirements(new ActiveUserRequirement()));
    }

    public static void UseAuthenticationProblemDetails(this WebApplication app)
    {
        app.UseStatusCodePages(async context =>
        {
            var response = context.HttpContext.Response;
            var request = context.HttpContext.Request;

            if (response.StatusCode == StatusCodes.Status401Unauthorized)
            {
                response.ContentType = "application/problem+json";
                await response.WriteAsJsonAsync(new ErrorProblemDetails
                {
                    Type = "https://tools.ietf.org/html/rfc7235#section-3.1",
                    Title = "Unauthorized",
                    Status = StatusCodes.Status401Unauthorized,
                    Detail = "Authentication is required to access this resource.",
                    Instance = request.Path,
                });
            }
            else if (response.StatusCode == StatusCodes.Status403Forbidden)
            {
                response.ContentType = "application/problem+json";
                await response.WriteAsJsonAsync(new ErrorProblemDetails
                {
                    Type = "https://tools.ietf.org/html/rfc7231#section-6.5.3",
                    Title = "Forbidden",
                    Status = StatusCodes.Status403Forbidden,
                    Detail = "You do not have permission to access this resource.",
                    Instance = request.Path,
                });
            }
        });
    }
}