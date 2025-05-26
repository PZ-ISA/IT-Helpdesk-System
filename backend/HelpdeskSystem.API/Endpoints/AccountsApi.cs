using HelpdeskSystem.API.Extensions;
using HelpdeskSystem.Domain.Dtos.Accounts;
using HelpdeskSystem.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HelpdeskSystem.API.Endpoints;

public static class AccountsApi
{
    public static IEndpointRouteBuilder MapAccountsApi(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api")
            .WithTags("Accounts")
            .AllowAnonymous()
            .WithOpenApi();

        group.MapPost("/register", async (IAccountService accountService, [FromBody] RegisterDto registerDto, CancellationToken ct) =>
        {
            await accountService.RegisterAsync(registerDto, ct);

            return Results.Created();
        })
        .WithRequestValidation<RegisterDto>()
        .Produces(StatusCodes.Status201Created)
        .WithDescription("""
             Creates a new user account with the provided registration details.
             - The account will be inactive by default until verified by an administrator.
             - If no role is provided, the 'Employee' role will be assigned automatically.
             """);

        group.MapPost("/login", async (IAccountService accountService, [FromBody] LoginDto loginDto, CancellationToken ct) =>
        {
            var result = await accountService.LoginAsync(loginDto, ct);

            return Results.Ok(result);
        })
        .Produces<LoginResponseDto>(StatusCodes.Status200OK, "application/json")
        .WithDescription("Authenticates a user and returns a JWT token and refresh token if the credentials are valid.");

        group.MapPost("/refresh-token", async (IAccountService accountService, [FromBody] RefreshTokenRequestDto refreshDto, CancellationToken ct) =>
        {
            var result = await accountService.RefreshTokenAsync(refreshDto, ct);
            
            return Results.Ok(result);
        })
        .Produces<LoginResponseDto>(StatusCodes.Status200OK, "application/json")
        .WithDescription("Authenticates user by a refresh token and returns new JWT token and new refresh token if the credentials are valid.");
        
        return app;
    }
}