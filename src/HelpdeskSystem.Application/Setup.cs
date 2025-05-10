using HelpdeskSystem.Application.Common;
using HelpdeskSystem.Application.Services;
using HelpdeskSystem.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Protocols.Configuration;

namespace HelpdeskSystem.Application;

public static class Setup
{
    public static void AddApplicationLogic(this IHostApplicationBuilder builder, IConfiguration configuration)
    {
        var jwtOptions = configuration.GetSection("JwtSettings").Get<JwtOptions>();
        if (jwtOptions == null)
        {
            throw new InvalidConfigurationException("JWTSettings not found in configuration");
        }
        
        builder.Services.AddSingleton(jwtOptions);
        
        builder.Services.AddHttpContextAccessor();
        builder.Services.AddScoped<IUserContextService, UserContextService>();
    }
}