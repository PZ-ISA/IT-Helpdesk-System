using HelpdeskSystem.Application.Common;
using HelpdeskSystem.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace HelpdeskSystem.Application.Seeders;

public static class ChatBotUserSeeder
{
    private const string Role = "ChatBot";
    
    public static async Task SeedAsync(RoleManager<IdentityRole<Guid>> roleManager, UserManager<User> userManager, IConfiguration configuration)
    {
        var chatBotUser = configuration.GetSection("ChatBot").Get<ChatBotUser>();
        if (chatBotUser is null)
        {
            throw new InvalidOperationException("ChatBot user properties not found in configuration");
        }
        
        if (await roleManager.RoleExistsAsync(Role) == false)
        {
            await roleManager.CreateAsync(new IdentityRole<Guid>(Role));
        }
        
        var existingUser = await userManager.FindByEmailAsync(chatBotUser.Username);
        if (existingUser is not null)
        {
            return;
        }
        
        var user = new User
        {
            Email = chatBotUser.Username,
            UserName = chatBotUser.Username,
            Name = "Chat",
            Surname = "Bot",
            IsActive = true,
        };

        var result = await userManager.CreateAsync(user, chatBotUser.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException(errors);
        }
        
        await userManager.AddToRoleAsync(user, Role);
    }
}