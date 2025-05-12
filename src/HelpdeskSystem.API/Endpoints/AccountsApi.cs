using HelpdeskSystem.API.Extensions;
using HelpdeskSystem.Domain.Dtos.Accounts;
using HelpdeskSystem.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HelpdeskSystem.API.Endpoints;

public static class AccountsApi
{
    public static void MapAccountsApi(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api")
            .WithTags("Accounts")
            .AllowAnonymous()
            .WithOpenApi();

        group.MapPost("/register", async (IAccountService accountService, [FromBody] RegisterDto registerDto, CancellationToken ct) =>
        {
            await accountService.RegisterAsync(registerDto, ct);

            return Results.Ok();
        })
        .WithRequestValidation<RegisterDto>()
        .Produces(StatusCodes.Status200OK);

        group.MapPost("/login", async (IAccountService accountService, [FromBody] LoginDto loginDto, CancellationToken ct) =>
        {
            var result = await accountService.LoginAsync(loginDto, ct);

            return Results.Ok(result);
        })
        .Produces<string>(StatusCodes.Status200OK, "application/json");
    }
}