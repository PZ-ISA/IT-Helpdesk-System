using HelpdeskSystem.API.Extensions;
using HelpdeskSystem.Domain.Dtos.Users;
using HelpdeskSystem.Domain.Interfaces;

namespace HelpdeskSystem.API.Endpoints;

public static class UserApi
{
    public static IEndpointRouteBuilder MapUserApi(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/users/me")
            .WithTags("Users")
            .RequireAuthorization("IsActive")
            .WithOpenApi();

        group.MapGet("", async (IUserService userService, CancellationToken ct) =>
        {
            var result = await userService.GetUserAsync(ct);

            return Results.Ok(result);
        })
        .Produces<UserDto>(StatusCodes.Status200OK, "application/json")
        .WithDescription("Returns the current user's profile information. User must be active.");

        group.MapPatch("/change-password", async (IUserService userService, ChangePasswordDto changePasswordDto, CancellationToken ct) =>
        {
            await userService.ChangePasswordAsync(changePasswordDto, ct);
            
            return Results.NoContent();
        })
        .WithRequestValidation<ChangePasswordDto>()
        .Produces(StatusCodes.Status204NoContent)
        .WithDescription("Changes the password of the current  user.");
        
        group.MapPut("", async (IUserService userService, UpdateUserDto updateUserDto, CancellationToken ct) =>
        {
            await userService.UpdateUserAsync(updateUserDto, ct);
            
            return Results.NoContent();
        })
        .WithRequestValidation<UpdateUserDto>()
        .Produces(StatusCodes.Status204NoContent)
        .WithDescription("Updates the profile data of the current  user.");

        return app;
    }
}