using HelpdeskSystem.Domain.Entities;
using HelpdeskSystem.Infrastructure.Contexts;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HelpdeskSystem.API.Extensions;

public static class DatabaseExtensions
{
    public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<HelpdeskDbContext>(options => 
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"))
        );
        
        services.AddIdentity<User, IdentityRole<Guid>>()
            .AddEntityFrameworkStores<HelpdeskDbContext>()
            .AddDefaultTokenProviders();
        
        return services;
    }
}