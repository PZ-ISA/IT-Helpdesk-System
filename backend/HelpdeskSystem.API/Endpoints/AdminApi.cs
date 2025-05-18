using HelpdeskSystem.API.Extensions;
using HelpdeskSystem.Domain.Interfaces;
using HelpdeskSystem.Domain.Common;
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
        .Produces<PaginatedResponseDto<UserDto>>(StatusCodes.Status200OK, "application/json");

        group.MapPatch("/users/{id:guid}", async (IAdminUserService adminUserService, [FromBody] UpdateUserStatusDto updateUserStatusDto, Guid id, CancellationToken ct) =>
        {
            await adminUserService.UpdateUserStatusAsync(updateUserStatusDto, id, ct);
            
            return Results.NoContent();
        })
        .Produces(StatusCodes.Status204NoContent);
        
        
        group.MapGet("/tickets", async (IAdminTicketService adminTicketService, [AsParameters] PageQueryFilterDto filterDto, TicketStatus status,CancellationToken ct) =>
        {
            var result = await adminTicketService.GetTicketsAsync(filterDto, status, ct);
            
            return Results.Ok(result);
        })
        .Produces<PaginatedResponseDto<TicketDto>>(StatusCodes.Status200OK, "application/json");
        
        group.MapGet("/tickets/{id:guid}", async (IAdminTicketService adminTicketService, Guid id,CancellationToken ct) =>
        {
            var result = await adminTicketService.GetTicketByIdAsync(id, ct);
        
            return Results.Ok(result);
        })
        .Produces<TicketDto>(StatusCodes.Status200OK, "application/json");
        
        group.MapPatch("/tickets/{id:guid}", async (IAdminTicketService adminTicketService, [FromBody] UpdateTicketEmployeeDto updateTicketEmployeeDto, Guid id, CancellationToken ct) =>
        {
            await adminTicketService.UpdateTicketEmployeeAsync(updateTicketEmployeeDto, id, ct);
        
            return Results.NoContent();
        })
        .Produces(StatusCodes.Status204NoContent);
        
        return app;
    }
}