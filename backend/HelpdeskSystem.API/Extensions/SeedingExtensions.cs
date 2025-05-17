using HelpdeskSystem.Application.Seeders;
using HelpdeskSystem.Domain.Entities;
using HelpdeskSystem.Infrastructure.Contexts;
using Microsoft.AspNetCore.Identity;

namespace HelpdeskSystem.API.Extensions;

public static class SeedingExtensions
{
    public static async Task SeedAsync(this WebApplication app, IConfiguration configuration)
    {
        await using var scope = app.Services.CreateAsyncScope();

        await using var context = scope.ServiceProvider.GetRequiredService<HelpdeskDbContext>();
        using var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        using var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        
        await context.Database.EnsureCreatedAsync();
        
        await RolesSeeder.SeedAsync(roleManager);
        await ChatBotUserSeeder.SeedAsync(roleManager, userManager, configuration);
    }
}