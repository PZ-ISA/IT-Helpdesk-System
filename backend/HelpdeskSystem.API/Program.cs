using HelpdeskSystem.API.Extensions;
using HelpdeskSystem.Application;
using HelpdeskSystem.Application.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDatabase(builder.Configuration);

builder.AddApplicationLogic(builder.Configuration);

builder.Services.AddJwtAuthentication();
builder.Services.AddAuthorization(options => options.AddAuthorizationPolicies());

builder.Services.AddOpenApiDocumentation();

builder.Services.ConfigureCulture();

builder.Services.AddCorsPolicy();

var app = builder.Build();

app.UseMiddleware<ErrorHandlingMiddleware>();
//app.UseExceptionHandler();
app.UseAuthenticationProblemDetails();

app.UseCors("FrontendClient");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("v1/swagger.json", "IT Helpdesk System API");
    });}

app.UseHttpsRedirection();

app.UseRequestLocalization();

app.UseAuthentication();
app.UseAuthorization();

app.RegisterEndpoints();

await app.SeedAsync(builder.Configuration);

app.Run();
