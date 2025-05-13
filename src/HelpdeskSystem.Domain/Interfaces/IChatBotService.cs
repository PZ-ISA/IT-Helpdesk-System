using HelpdeskSystem.Domain.Common;
using HelpdeskSystem.Domain.Dtos;
using HelpdeskSystem.Domain.Dtos.ChatBot;

namespace HelpdeskSystem.Domain.Interfaces;

public interface IChatBotService
{
    Task<StartSessionResponseDto> StartSessionAsync(ChatBotMessageDto messageDto, CancellationToken ct);
    Task EndSessionAsync(Guid sessionId, FeedbackDto? feedbackDto, CancellationToken ct);
    Task<ChatBotMessageDto> SendMessageAsync(Guid sessionId, ChatBotMessageDto messageDto, CancellationToken ct);
    Task<PaginatedResponseDto<ChatBotMessageDto>> GetSessionMessagesAsync(Guid sessionId, PageQueryFilterDto filterDto, CancellationToken ct);
    Task<PaginatedResponseDto<ChatBotSessionDto>> GetSessionsAsync(PageQueryFilterDto filterDto, CancellationToken ct);
    Task UpdateSessionTitleAsync(Guid sessionId, UpdateTitleDto titleDto, CancellationToken ct);
}