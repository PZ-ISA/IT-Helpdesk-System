using Bogus;
using HelpdeskSystem.Domain.Entities;
using HelpdeskSystem.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace HelpdeskSystem.Application.Seeders;

public static class ChatBotMessagesSeeder
{
    private static readonly Random R = new();
    
    public static async Task SeedAsync(HelpdeskDbContext dbContext, TimeProvider timeProvider)
    {
        if (await dbContext.ChatBotMessages.AnyAsync())
        {
            return;
        }
        
        var sampleSessions = await dbContext.ChatBotSessions
            .Include(x => x.ChatBotMessages)
            .ToListAsync();

        var faker = new Faker();
        var messages = new List<ChatBotMessage>();
        
        foreach (var session in sampleSessions)
        {
            // Random count of messages per chatBot session
            int sessionMessagesCount = R.Next(3, 7);

            var sessionStart = session.CreatedAt.DateTime;
            var sessionEnd = session.EndDate ?? timeProvider.GetUtcNow();
            var sessionEndDateTime = sessionEnd.DateTime;
            
            for (int i = 0; i < sessionMessagesCount; i++)
            {
                var timestamp = faker.Date.Between(sessionStart, sessionEndDateTime);
                
                messages.Add(new ChatBotMessage
                {
                    Message = faker.Lorem.Sentences(),
                    IsUserMessage = faker.Random.Bool(),
                    CreatedAt = timestamp,
                    UpdatedAt = timestamp,
                    ChatBotSessionId = session.Id,
                });
            }
        }
        
        await dbContext.ChatBotMessages.AddRangeAsync(messages);
        await dbContext.SaveChangesAsync();
    }
}