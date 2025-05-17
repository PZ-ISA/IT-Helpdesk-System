using HelpdeskSystem.API.Extensions;
using HelpdeskSystem.Domain.Interfaces;
using HelpdeskSystem.Domain.Common;
using HelpdeskSystem.Domain.Dtos.Users;

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

        group.MapGet("/users", async (IAdminUserService adminUserService, [AsParameters] PageQueryFilterDto filterDto, bool? isActive, CancellationToken ct) =>
        {
            var result = await adminUserService.GetUsersAsync(filterDto, isActive, ct);

            return Results.Ok(result);
        })
        .WithRequestValidation<PageQueryFilterDto>()
        .Produces<PaginatedResponseDto<UserDto>>(StatusCodes.Status200OK, "application/json");

        group.MapPut("/users", async (IAdminUserService adminUserService, UserStatusDto userStatusDto, CancellationToken ct) =>
        {
            await adminUserService.UpdateUserStatusAsync(userStatusDto, ct);
            
            return Results.NoContent();
        })
        .Produces(StatusCodes.Status204NoContent);

        return app;
    }
}