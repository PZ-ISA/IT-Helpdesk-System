using HelpdeskSystem.Domain.Hubs;

namespace HelpdeskSystem.API.Endpoints;

public static class NotificationApi
{
    public static IEndpointRouteBuilder MapNotificationApi(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/notifications")
            .WithTags("Notifications")
            .RequireAuthorization("IsActive")
            .WithOpenApi();

        group.MapHub<NotificationHub>("");
        
        return app;
    }
}