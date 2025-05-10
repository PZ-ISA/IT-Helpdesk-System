using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HelpdeskSystem.Application.Seeders;

public static class RolesSeeder
{
    private static readonly string[] Roles = [ "Admin", "User" ];
    
    public static async Task SeedAsync(RoleManager<IdentityRole> roleManager)
    {
        foreach (var role in Roles)
        {
            if (await roleManager.RoleExistsAsync(role))
            {
                continue;
            }
            
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }
}