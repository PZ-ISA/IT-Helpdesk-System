namespace HelpdeskSystem.API.Extensions;

public static class CorsExtensions
{
    public static void AddCorsPolicy(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("FrontendClient", policy =>
            {
                policy.WithOrigins("http://localhost:5173")
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
            });
        });
    }
}