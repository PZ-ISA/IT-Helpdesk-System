using HelpdeskSystem.Domain.Common;
using HelpdeskSystem.Domain.Interfaces;
using HelpdeskSystem.Domain.Dtos.TicketMessages;
using Microsoft.AspNetCore.Mvc;

namespace HelpdeskSystem.API.Endpoints;

public static class TicketMessageApi
{
    public static IEndpointRouteBuilder MapTicketMessageApi(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/tickets/{id:guid}/messages")
            .WithTags("TicketMessages")
            .RequireAuthorization("IsActive")
            .WithOpenApi();
        
        group.MapGet("", async (ITicketMessageService ticketMessageService, [AsParameters] PageQueryFilterDto filterDto, Guid id, CancellationToken ct) =>
        {
            var result = await ticketMessageService.GetTicketMessagesAsync(filterDto, id, ct);
            
            return Results.Ok(result);
        })
        .Produces<PaginatedResponseDto<TicketMessageDto>>(StatusCodes.Status200OK, "application/json")
        .WithDescription("Returns a paginated list of messages for a given ticket.");
        
        group.MapPost("", async (ITicketMessageService ticketMessageService, CreateTicketMessageDto createTicketMessageDto, Guid id, CancellationToken ct) =>
        {
            await ticketMessageService.CreateTicketMessageAsync(createTicketMessageDto, id, ct);

            return Results.Created();
        })
        .Produces(StatusCodes.Status201Created)
        .WithDescription("Adds a new message to the given ticket.");

        return app;
    }
}