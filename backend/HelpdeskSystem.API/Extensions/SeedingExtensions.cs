using HelpdeskSystem.Application.Seeders;
using HelpdeskSystem.Domain.Entities;
using HelpdeskSystem.Infrastructure.Contexts;
using Microsoft.AspNetCore.Identity;

namespace HelpdeskSystem.API.Extensions;

public static class SeedingExtensions
{
    private const int AdminCount = 5;
    private const int EmployeeCount = 15;
    private const int TicketsCount = 20;
    private const int ChatBotSessionsCount = 30;
    private const int NotificationsCount = 40;
    
    public static async Task SeedAsync(this WebApplication app, IConfiguration configuration)
    {
        await using var scope = app.Services.CreateAsyncScope();

        await using var context = scope.ServiceProvider.GetRequiredService<HelpdeskDbContext>();
        using var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        using var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var timeProvider = scope.ServiceProvider.GetRequiredService<TimeProvider>();
        
        await context.Database.EnsureCreatedAsync();
        
        // Required seeders
        await RolesSeeder.SeedAsync(roleManager);
        await ChatBotUserSeeder.SeedAsync(roleManager, userManager, configuration);
        
        // Development seeders
        if (app.Environment.IsDevelopment())
        {
            await UsersSeeder.SeedAsync(userManager, EmployeeCount, AdminCount);
            await TicketsSeeder.SeedAsync(context, userManager, TicketsCount);
            await TicketMessagesSeeder.SeedAsync(context);
            await ChatBotSessionsSeeder.SeedAsync(context, timeProvider, ChatBotSessionsCount);
            await ChatBotMessagesSeeder.SeedAsync(context, timeProvider);
            await NotificationsSeeder.SeedAsync(context, NotificationsCount);
        }
    }
}