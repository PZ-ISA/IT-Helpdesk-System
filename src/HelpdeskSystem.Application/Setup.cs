using FluentValidation;
using HelpdeskSystem.Application.Common;
using HelpdeskSystem.Application.Middleware;
using HelpdeskSystem.Application.Services;
using HelpdeskSystem.Application.Validators;
using HelpdeskSystem.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
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

        builder.Services.AddSingleton(TimeProvider.System);
        
        //builder.Services.AddProblemDetails();
        //builder.Services.AddExceptionHandler<CustomExceptionHandler>();
        builder.Services.AddScoped<ErrorHandlingMiddleware>();
        builder.Services.AddSingleton<IAuthorizationHandler, ActiveUserAuthorizationHandler>();
        
        builder.Services.AddSingleton(jwtOptions);

        builder.Services.AddValidatorsFromAssemblyContaining<PageQueryFilterDtoValidator>();

        builder.Services.AddScoped<IUserContextService, UserContextService>();
        builder.Services.AddScoped<IAccountService, AccountService>();
        builder.Services.AddScoped<IChatBotService, ChatBotService>();
    }
}