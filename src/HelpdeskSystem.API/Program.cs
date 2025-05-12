using HelpdeskSystem.API.Extensions;
using HelpdeskSystem.Application;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDatabase(builder.Configuration);

builder.AddApplicationLogic(builder.Configuration);

builder.Services.AddJwtAuthentication();
builder.Services.AddAuthorization();

builder.Services.AddOpenApiDocumentation();

var app = builder.Build();

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

app.UseExceptionHandler();
app.UseStatusCodePages();

app.RegisterEndpoints();

await app.SeedAsync();

app.Run();
