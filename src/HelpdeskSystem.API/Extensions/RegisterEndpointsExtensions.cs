using HelpdeskSystem.API.Endpoints;

namespace HelpdeskSystem.API.Extensions;

public static class RegisterEndpointsExtensions
{
    public static void RegisterEndpoints(this IEndpointRouteBuilder app)
    {
        app
            .MapAccountsApi()
            .MapChatBotApi()
            .MapTicketApi();
    }
}