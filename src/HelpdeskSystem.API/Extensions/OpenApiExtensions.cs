using Microsoft.OpenApi.Models;

namespace HelpdeskSystem.API.Extensions;

public static class OpenApiExtensions
{
    public static void AddOpenApiDocumentation(this IServiceCollection services)
    {
        services.AddOpenApi();

        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "IT Helpdesk System API",
                Version = "v1",
                Description = "Documentation of backend for IT Helpdesk System application."
            });

            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "JWT Authorization header using the Bearer scheme.\n" +
                              "Enter 'Bearer' [space] and then your token in the text input below.\n" +
                              "Example: 'Bearer 12345abcdef'"
            });

            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new List<string>()
                }
            });
        });
    }
}