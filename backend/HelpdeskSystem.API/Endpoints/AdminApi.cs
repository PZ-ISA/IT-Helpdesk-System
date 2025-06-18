using HelpdeskSystem.API.Extensions;
using HelpdeskSystem.Domain.Interfaces;
using HelpdeskSystem.Domain.Common;
using HelpdeskSystem.Domain.Dtos.Takeover;
using HelpdeskSystem.Domain.Dtos.Tickets;
using HelpdeskSystem.Domain.Dtos.Users;
using HelpdeskSystem.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace HelpdeskSystem.API.Endpoints;

public static class AdminApi
{
    public static IEndpointRouteBuilder MapAdminApi(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/admin")
            .WithTags("Admin")
            .RequireAuthorization("Admin")
            .RequireAuthorization("IsActive")
            .WithOpenApi();

        group.MapGet("/users", async (IAdminUserService adminUserService, [AsParameters] PageQueryFilterDto filterDto, bool? status, CancellationToken ct) =>
        {
            var result = await adminUserService.GetUsersAsync(filterDto, status, ct);

            return Results.Ok(result);
        })
        .WithRequestValidation<PageQueryFilterDto>()
        .Produces<PaginatedResponseDto<UserDto>>(StatusCodes.Status200OK, "application/json")
        .WithDescription("Returns paginated list of users. You can optionally filter by user status. Allowed page sizes [10,25,50,100].");

        group.MapPatch("/users/{id:guid}", async (IAdminUserService adminUserService, [FromBody] UpdateUserStatusDto updateUserStatusDto, Guid id, CancellationToken ct) =>
        {
            await adminUserService.UpdateUserStatusAsync(updateUserStatusDto, id, ct);
            
            return Results.NoContent();
        })
        .Produces(StatusCodes.Status204NoContent)
        .WithDescription("Updates active status for given user (e.g. activate or deactivate).");
        
        
        group.MapGet("/tickets", async (IAdminTicketService adminTicketService, [AsParameters] PageQueryFilterDto filterDto, TicketStatus? status, CancellationToken ct) =>
        {
            var result = await adminTicketService.GetTicketsAsync(filterDto, status, ct);
            
            return Results.Ok(result);
        })
        .Produces<PaginatedResponseDto<TicketDto>>(StatusCodes.Status200OK, "application/json")
        .WithDescription("Returns a paginated list of tickets. You can optionally filter by ticket status.");
        
        group.MapGet("/tickets/{id:guid}", async (IAdminTicketService adminTicketService, Guid id,CancellationToken ct) =>
        {
            var result = await adminTicketService.GetTicketByIdAsync(id, ct);
        
            return Results.Ok(result);
        })
        .Produces<TicketDto>(StatusCodes.Status200OK, "application/json")
        .WithDescription("Returns the details of a given ticket.");
        
        group.MapPost("/tickets/{id:guid}/assign", async (IAdminTicketService adminTicketService, Guid id, CancellationToken ct) =>
        {
            await adminTicketService.AssignAdminToTicketAsync(id, ct);
        
            return Results.Ok();
        })
        .Produces(StatusCodes.Status200OK)
        .WithDescription("Assigns the currently logged-in admin to the ticket. The ticket must have a status of 'New' and must not be assigned to a different admin.");
        
        group.MapPost("/tickets/{id:guid}/close", async (IAdminTicketService adminTicketService, Guid id, CancellationToken ct) =>
        {
            await adminTicketService.CloseTicketAsync(id, ct);
    
            return Results.Ok();
        })
        .Produces(StatusCodes.Status200OK)
        .WithDescription("Closes the ticket. The ticket must have a status of 'Active' and only the assigned admin can perform this action.");

        group.MapGet("/tickets/takeovers/received", async (IAdminTicketTakeoverService adminTicketTakeover, [AsParameters] PageQueryFilterDto filterDto, CancellationToken ct) =>
        {
            var result = await adminTicketTakeover.GetIncomingTakeoversAsync(filterDto, ct);
            
            return Results.Ok(result);
        })
        .WithRequestValidation<PageQueryFilterDto>()
        .Produces<PaginatedResponseDto<TakeoverDto>>(StatusCodes.Status200OK, "application/json")
        .WithDescription("Returns a paginated list of takeover requests received by current user. Allowed page sizes [10,25,50,100]");
        
        
        group.MapGet("/tickets/takeovers/sent", async (IAdminTicketTakeoverService adminTicketTakeover, [AsParameters] PageQueryFilterDto filterDto, CancellationToken ct) =>
        {
            var result = await adminTicketTakeover.GetOutgoingTakeoversAsync(filterDto, ct);
        
            return Results.Ok(result);
        })
        .WithRequestValidation<PageQueryFilterDto>()
        .Produces<PaginatedResponseDto<TakeoverDto>>(StatusCodes.Status200OK, "application/json")
        .WithDescription("Returns a paginated list of takeover requests created by current user. Allowed page sizes [10,25,50,100]");

        group.MapPost("/tickets/takeovers/{id:guid}/decide", async (IAdminTicketTakeoverService adminTicketTakeover, Guid id, [FromBody] bool decision, CancellationToken ct) =>
        {
            await adminTicketTakeover.DecideOnTakeoverRequestAsync(id, decision, ct);

            return Results.Ok();
        })
        .Produces(StatusCodes.Status200OK)
        .WithDescription("Decides on ticket takeover request.");
        
        group.MapPost("/tickets/{id:guid}/takeovers", async (IAdminTicketTakeoverService adminTicketTakeover, Guid id, CancellationToken ct) =>
        {
            await adminTicketTakeover.CreateTakeoverRequestAsync(id, ct);

            return Results.Created();
        })
        .Produces(StatusCodes.Status201Created)
        .WithDescription("Creates a new ticket takeover request.");
        
        group.MapDelete("tickets/takeovers/{id:guid}", async (IAdminTicketTakeoverService adminTicketTakeover, Guid id, CancellationToken ct) =>
        {
            await adminTicketTakeover.DeleteTakeoverRequestAsync(id, ct);

            return Results.NoContent();
        })
        .Produces(StatusCodes.Status204NoContent)
        .WithDescription("Deletes a given ticket takeover request.");
        
        return app;
    }
}