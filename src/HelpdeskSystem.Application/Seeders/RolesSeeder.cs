using HelpdeskSystem.Application.Common;
using Microsoft.AspNetCore.Identity;

namespace HelpdeskSystem.Application.Seeders;

public static class RolesSeeder
{
    public static async Task SeedAsync(RoleManager<IdentityRole> roleManager)
    {
        foreach (var role in Roles.RolesNames)
        {
            if (await roleManager.RoleExistsAsync(role))
            {
                continue;
            }
            
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }
}