using HelpdeskSystem.API.Extensions;
using HelpdeskSystem.Domain.Common;
using HelpdeskSystem.Domain.Dtos.ChatBot;
using HelpdeskSystem.Domain.Dtos.Common;
using HelpdeskSystem.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HelpdeskSystem.API.Endpoints;

public static class ChatBotApi
{
    public static IEndpointRouteBuilder MapChatBotApi(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/chatbot-sessions")
            .WithTags("ChatBot")
            .RequireAuthorization("IsActive")
            .WithOpenApi();

        group.MapPost("", async (IChatBotService chatBotService, [FromBody] ChatBotMessageDto messageDto, CancellationToken ct) =>
        {
            var result = await chatBotService.StartSessionAsync(messageDto, ct);
            
            return Results.Created($"/api/chatbot-sessions/{result.SessionId}", result);
        })
        .WithRequestValidation<ChatBotMessageDto>()
        .Produces<StartSessionResponseDto>(StatusCodes.Status201Created, "application/json")
        .WithDescription("Starting new chatbot session. New session will be created and it ID will be returned with chat bot answer. This endpoint is only accessible for creating new session, not for conversation");

        group.MapPost("/{id:guid}/messages", async (IChatBotService chatBotService, [FromBody] ChatBotMessageDto messageDto, Guid id, CancellationToken ct) =>
        {
            var result = await chatBotService.SendMessageAsync(id, messageDto, ct);
            
            return Results.Ok(result);
        })
        .WithRequestValidation<ChatBotMessageDto>()
        .Produces<ChatBotMessageDto>(StatusCodes.Status200OK, "application/json")
        .WithDescription("Adding new user message to chat bot session for which Chat bot will replay. The session must be active.");

        group.MapPatch("/{id:guid}/title", async (IChatBotService chatBotService, [FromBody] UpdateTitleDto titleDto, Guid id, CancellationToken ct) =>
        {
            await chatBotService.UpdateSessionTitleAsync(id, titleDto, ct);
            
            return Results.NoContent();
        })
        .WithRequestValidation<UpdateTitleDto>()
        .Produces(StatusCodes.Status204NoContent)
        .WithDescription("Changes the title of existing chatbot session.");

        group.MapGet("", async (IChatBotService chatBotService, [AsParameters] PageQueryFilterDto filterDto, CancellationToken ct) =>
        {
            var result= await chatBotService.GetSessionsAsync(filterDto, ct);
            
            return Results.Ok(result);
        })
        .WithRequestValidation<PageQueryFilterDto>()
        .Produces<PaginatedResponseDto<ChatBotSessionDto>>(StatusCodes.Status200OK, "application/json")
        .WithDescription("Returns a paginated list of chatbot sessions belonging to the currently logged-in user. Allowed page sizes [10,25,50,100]");

        group.MapGet("/{id:guid}/messages", async (IChatBotService chatBotService, [AsParameters] PageQueryFilterDto filterDto, Guid id, CancellationToken ct) =>
        {
            var result = await chatBotService.GetSessionMessagesAsync(id, filterDto, ct);
            
            return Results.Ok(result);
        })
        .WithRequestValidation<PageQueryFilterDto>()
        .Produces<PaginatedResponseDto<ChatBotMessageResponseDto>>(StatusCodes.Status200OK, "application/json")
        .WithDescription("Returns a paginated list of messages exchanged within a specific chatbot session. Allowed page sizes [10,25,50,100]");

        group.MapPost("/{id:guid}/end", async (IChatBotService chatBotService, FeedbackDto? feedbackDto, Guid id, CancellationToken ct) =>
        {
            await chatBotService.EndSessionAsync(id, feedbackDto, ct);

            return Results.NoContent();
        })
        .WithRequestValidation<FeedbackDto>()
        .Produces(StatusCodes.Status204NoContent)
        .WithDescription("Ends the chatbot session and optionally saves the user's feedback. No more messages can be sent after ending the session.");

        return app;
    }
}