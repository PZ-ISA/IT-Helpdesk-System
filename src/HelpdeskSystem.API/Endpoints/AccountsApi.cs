using HelpdeskSystem.API.Extensions;
using HelpdeskSystem.Application.Services;
using HelpdeskSystem.Application.Validators.Accounts;
using HelpdeskSystem.Domain.Dtos.Accounts;
using Microsoft.AspNetCore.Mvc;

namespace HelpdeskSystem.API.Endpoints;

public static class AccountsApi
{
    public static void MapAccountsApi(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api")
            .WithTags(typeof(AccountsApi).ToString())
            .AllowAnonymous();

        group.MapPost("/register", async (AccountService accountService, [FromBody] RegisterDto dto, CancellationToken ct) =>
        {
            await accountService.RegisterAsync(dto, ct);
            
            return Results.Ok();
        })
        .WithRequestValidation<RegisterDto>();
        

        group.MapPost("/login", async (AccountService accountService, [FromBody] LoginDto dto, CancellationToken ct) =>
        {
            var result = await accountService.LoginAsync(dto, ct);
            
            return Results.Ok(result);
        });
    }
}