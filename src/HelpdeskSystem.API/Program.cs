using HelpdeskSystem.API.Extensions;
using HelpdeskSystem.Application;
using HelpdeskSystem.Application.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDatabase(builder.Configuration);

builder.AddApplicationLogic(builder.Configuration);

builder.Services.AddJwtAuthentication();
builder.Services.AddAuthorization();

builder.Services.AddOpenApiDocumentation();

var app = builder.Build();

app.UseMiddleware<ErrorHandlingMiddleware>();
//app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("v1/swagger.json", "IT Helpdesk System API");
    });}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.RegisterEndpoints();

await app.SeedAsync();

app.Run();
