using HelpdeskSystem.Domain.Dtos.ExportData;
using HelpdeskSystem.Domain.Interfaces;

namespace HelpdeskSystem.API.Endpoints;

public static class ExportDataApi
{
    public static IEndpointRouteBuilder MapExportDataApi(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/export-data")
            .WithTags("ExportData")
            .WithOpenApi()
            .RequireAuthorization("ChatBot")
            .RequireAuthorization("IsActive");

        group.MapGet("/tickets", async (IDataExportService dataExportService, CancellationToken ct) =>
        {
            var result = await dataExportService.ExportTicketsDataAsync(ct);

            return Results.Ok(result);
        })
        .Produces<ICollection<ExportTicketDto>>(StatusCodes.Status200OK, "application/json");
        
        group.MapGet("/chats", async (IDataExportService dataExportService, CancellationToken ct) =>
        { 
            var result = await dataExportService.ExportChatDataAsync(ct);
            
            return Results.Ok(result);
        })
        .Produces<ICollection<ExportChatDto>>(StatusCodes.Status200OK, "application/json");
        
        return app;
    }
}