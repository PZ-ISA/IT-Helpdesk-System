using Bogus;
using HelpdeskSystem.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HelpdeskSystem.Application.Seeders;

public static class UsersSeeder
{
    private const string Password = "Haslo123!"; 
    
    public static async Task SeedAsync(UserManager<User> userManager, int employeesCount, int adminsCount)
    {
        var seedUserCount = employeesCount + adminsCount;
        var count = await userManager.Users.CountAsync();
        
        // Skip if there is more than chat bot user who has been already seeded
        if (count > 1)
        {
            return;
        }
        
        var faker = new Faker<User>("pl")
            .RuleFor(u => u.Name, f => f.Person.FirstName)
            .RuleFor(u => u.Surname, f => f.Person.LastName)
            .RuleFor(u => u.Email, (f, u) => f.Internet.Email(u.Name, u.Surname))
            .RuleFor(u => u.IsActive, f => f.PickRandom(false, true));
        
        var users = faker.Generate(seedUserCount);

        for (var i = 0; i < seedUserCount; i++)
        {
            var user = users[i];
            
            user.UserName = user.Email;
            
            if (await userManager.FindByEmailAsync(user.Email!) != null)
                continue;
            
            await userManager.CreateAsync(user, Password);

            var role = i < adminsCount ? "Admin" : "Employee";
            await userManager.AddToRoleAsync(user, role);
        }
    }
}