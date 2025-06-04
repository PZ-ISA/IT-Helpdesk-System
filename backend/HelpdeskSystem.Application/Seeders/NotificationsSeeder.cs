using Bogus;
using HelpdeskSystem.Domain.Entities;
using HelpdeskSystem.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace HelpdeskSystem.Application.Seeders;

public static class NotificationsSeeder
{
    public static async Task SeedAsync(HelpdeskDbContext dbContext, int notificationsCount)
    {
        if (await dbContext.Notifications.AnyAsync())
        {
            return;
        }
        
        var sampleUsers = await dbContext.Users.ToListAsync();
        
        var faker = new Faker<Notification>()
            .RuleFor(n => n.Title, f => f.Lorem.Sentence())
            .RuleFor(n => n.Content, f => f.Lorem.Sentences())
            .RuleFor(n => n.Seen, f => f.Random.Bool())
            .RuleFor(n => n.User, f => f.PickRandom(sampleUsers))
            .RuleFor(n => n.UserId, (_, nt) => nt.User!.Id);
        
        var notifications = faker.Generate(notificationsCount);
        
        await dbContext.Notifications.AddRangeAsync(notifications);
        await dbContext.SaveChangesAsync();
    }
}