using Bogus;
using HelpdeskSystem.Domain.Entities;
using HelpdeskSystem.Domain.Enums;
using HelpdeskSystem.Infrastructure.Contexts;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HelpdeskSystem.Application.Seeders;

public static class TicketsSeeder
{
    private static readonly Random R = new();
    
    public static async Task SeedAsync(HelpdeskDbContext dbContext, UserManager<User> userManager, int ticketsCount)
    {
        if (await dbContext.Tickets.AnyAsync())
        {
            return;
        }

        var sampleEmployees = await userManager.GetUsersInRoleAsync("Employee");
        var sampleAdmins = await userManager.GetUsersInRoleAsync("Admin");

        if (!sampleEmployees.Any() && !sampleAdmins.Any())
        {
            return;
        }
        
        var faker = new Faker<Ticket>("pl")
            .RuleFor(t => t.Title, f => f.Lorem.Sentence())
            .RuleFor(t => t.Description, f => f.Lorem.Sentences())
            .RuleFor(t => t.Status, f => f.PickRandom<TicketStatus>())
            .RuleFor(t => t.EmployeeUser, f => f.PickRandom(sampleEmployees))
            .RuleFor(t => t.EmployeeUserId, (_, t) => t.EmployeeUser!.Id);

        var tickets = faker.Generate(ticketsCount);

        foreach (var ticket in tickets)
        {
            if (ticket.Status != TicketStatus.New)
            {
                var admin = sampleAdmins.ElementAt(R.Next(sampleAdmins.Count));
                ticket.AdminUserId = admin.Id;
            }

            if (ticket.Status == TicketStatus.Closed && R.NextDouble() < 0.75)
            { 
                ticket.Feedback = (Feedback)R.Next(1,6);
            }
        }
    
        await dbContext.Tickets.AddRangeAsync(tickets);
        await dbContext.SaveChangesAsync();
    }
}