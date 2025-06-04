using Bogus;
using HelpdeskSystem.Domain.Entities;
using HelpdeskSystem.Domain.Enums;
using HelpdeskSystem.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace HelpdeskSystem.Application.Seeders;

public static class ChatBotSessionsSeeder
{
    private static readonly Random R = new();
    
    public static async Task SeedAsync(HelpdeskDbContext dbContext, TimeProvider timeProvider, int chatBotSessionsCount)
    {
        if (await dbContext.ChatBotSessions.AnyAsync())
        {
            return;
        }
        
        var sampleUsers = await dbContext.Users.ToListAsync();
        if (sampleUsers.Count == 0)
        {
            return;
        }

        var faker = new Faker<ChatBotSession>("pl")
            .RuleFor(x => x.Title, f => f.Lorem.Sentence(1, 5))
            .RuleFor(x => x.User, f => f.PickRandom(sampleUsers))
            .RuleFor(x => x.UserId, (_, x) => x.User!.Id)
            .RuleFor(x => x.CreatedAt, 
                f => timeProvider.GetUtcNow() - TimeSpan.FromMinutes(f.Random.Int(5, 120)))
            .RuleFor(x => x.UpdatedAt, (_, cbs) => cbs.CreatedAt)
            .RuleFor(x => x.EndDate, (f, cbs) => R.NextDouble() < 0.6
                ? cbs.CreatedAt + TimeSpan.FromMinutes(f.Random.Int(5, 120))
                : null)
            .RuleFor(x => x.Feedback, (f, session) =>
                session.EndDate != null && R.NextDouble() < 0.75
                    ? f.PickRandom<Feedback>()
                    : null);
        
        var sessions = faker.Generate(chatBotSessionsCount);
        
        await dbContext.ChatBotSessions.AddRangeAsync(sessions);
        await dbContext.SaveChangesAsync();
    }
}