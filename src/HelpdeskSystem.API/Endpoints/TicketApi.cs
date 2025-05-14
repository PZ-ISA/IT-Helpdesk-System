namespace HelpdeskSystem.API.Endpoints;

public static class TicketApi
{
    public static IEndpointRouteBuilder MapTicketApi(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/tickets")
            .WithTags("Ticket")
            .RequireAuthorization("IsActive")
            .RequireAuthorization("Employee")
            .WithOpenApi();
        
        
        return app;
    }
}