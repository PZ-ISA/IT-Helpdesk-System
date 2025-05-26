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
        .Produces<ICollection<ExportTicketDto>>(StatusCodes.Status200OK, "application/json")
        .WithDescription("Exports all closed tickets that contain messages and feedback. Each ticket includes its metadata and the messages exchanged, with sender roles.");
        
        group.MapGet("/chats", async (IDataExportService dataExportService, CancellationToken ct) =>
        { 
            var result = await dataExportService.ExportChatDataAsync(ct);
            
            return Results.Ok(result);
        })
        .Produces<ICollection<ExportChatDto>>(StatusCodes.Status200OK, "application/json")
        .WithDescription("Exports all chatbot sessions that include both messages and user feedback. Each session includes its metadata and the exchanged messages.");
        
        return app;
    }
}