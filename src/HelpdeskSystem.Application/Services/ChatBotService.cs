using HelpdeskSystem.Application.Utils;
using HelpdeskSystem.Domain.Common;
using HelpdeskSystem.Domain.Dtos.ChatBot;
using HelpdeskSystem.Domain.Entities;
using HelpdeskSystem.Domain.Exceptions;
using HelpdeskSystem.Domain.Interfaces;
using HelpdeskSystem.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace HelpdeskSystem.Application.Services;

public class ChatBotService : IChatBotService
{
    private readonly HelpdeskDbContext _dbContext;
    private readonly IUserContextService _userContextService;
    private readonly TimeProvider _timeProvider;
    
    public ChatBotService(HelpdeskDbContext dbContext, IUserContextService userContextService, TimeProvider timeProvider)
    {
        _dbContext = dbContext;
        _userContextService = userContextService;
        _timeProvider = timeProvider;
    }
    
    public async Task<StartSessionResponseDto> StartSessionAsync(ChatBotMessageDto messageDto, CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedException("User is not logged in.");
        }

        var chatBotSession = new ChatBotSession
        {
            Title = $"Chat - {_timeProvider.GetUtcNow():yyyy-MM-dd-h-mm}",
            UserId = userId.Value,
            ChatBotMessages = new List<ChatBotMessage>()
            {
                new()
                {
                    CreatedAt = messageDto.Date,
                    UpdatedAt = messageDto.Date,
                    Message = messageDto.Message,
                    IsUserMessage = true
                },
                new()
                {
                    //chatbot - to do
                    Message = "Welcome to chatbot!",
                    IsUserMessage = false
                }
            }
        };
        
        await _dbContext.ChatBotSessions.AddAsync(chatBotSession, ct);
        await _dbContext.SaveChangesAsync(ct);
        
        //todo - chatbot
        var response = new StartSessionResponseDto
        {
            SessionId = chatBotSession.Id,
            Message = "Welcome to the chatbot!",
            Date = _timeProvider.GetUtcNow(),
        };
        
        return response;
    }

    public async Task EndSessionAsync(Guid sessionId, FeedbackDto? feedbackDto, CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedException("User is not logged in.");
        }
        
        var chatBotSession = await _dbContext.ChatBotSessions
            .FirstOrDefaultAsync(x => x.Id == sessionId && x.UserId == userId, ct);
        
        if (chatBotSession == null)
        {
            throw new NotFoundException("Chat bot session not found.");
        }

        if (chatBotSession.EndDate != null)
        {
            throw new BadRequestException("The chatbot session has already ended.");
        }
        
        chatBotSession.Feedback = feedbackDto?.Feedback;
        chatBotSession.EndDate = _timeProvider.GetUtcNow();
        
        await _dbContext.SaveChangesAsync(ct);
    }

    public async Task<ChatBotMessageDto> SendMessageAsync(Guid sessionId, ChatBotMessageDto messageDto, CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedException("User is not logged in.");
        }
        
        var chatBotSession = await _dbContext.ChatBotSessions
            .Include(x => x.ChatBotMessages)
            .FirstOrDefaultAsync(x => x.Id == sessionId && x.UserId == userId, ct);
        
        if (chatBotSession == null)
        {
            throw new NotFoundException("Chat bot session not found.");
        }

        if (chatBotSession.EndDate != null)
        {
            throw new BadRequestException("The chatbot session has ended.");
        }

        chatBotSession.ChatBotMessages?.Add(new ChatBotMessage
        {
            CreatedAt = messageDto.Date,
            UpdatedAt = messageDto.Date,
            Message = messageDto.Message,
            IsUserMessage = true
        });
        
        //chatbot to do
        
        chatBotSession.ChatBotMessages?.Add(new ChatBotMessage
        {
            Message = "Welcome to chatbot!",
            IsUserMessage = false
        });
        
        await _dbContext.SaveChangesAsync(ct);

        var response = new ChatBotMessageDto
        {
            Message = "Welcome to chatbot!",
            Date = _timeProvider.GetUtcNow(),
        };
        
        return response;
    }

    public async Task<PaginatedResponseDto<ChatBotMessageResponseDto>> GetSessionMessagesAsync(Guid sessionId, PageQueryFilterDto filterDto, CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedException("User is not logged in.");
        }
        
        var chatBotSession = await _dbContext.ChatBotSessions
            .Include(x => x.ChatBotMessages)
            .FirstOrDefaultAsync(x => x.Id == sessionId && x.UserId == userId, ct);
        
        if (chatBotSession == null || chatBotSession.ChatBotMessages == null)
        {
            throw new NotFoundException("Chat bot session not found.");
        }
        
        var count = chatBotSession.ChatBotMessages.Count;
        
        var messages = chatBotSession.ChatBotMessages
            .OrderByDescending(x => x.UpdatedAt)
            .Select(x => new ChatBotMessageResponseDto
            {
                Id = x.Id,
                CreatedAt = x.CreatedAt,
                Message = x.Message,
                IsUserMessage = x.IsUserMessage,
                ChatBotSessionId = x.ChatBotSessionId,
            })
            .Paginate(filterDto.PageNumber, filterDto.PageSize)
            .ToList();
        
        var result = new PaginatedResponseDto<ChatBotMessageResponseDto>(messages, filterDto.PageNumber, filterDto.PageSize, count);
        
        return result;
    }

    public async Task<PaginatedResponseDto<ChatBotSessionDto>> GetSessionsAsync(PageQueryFilterDto filterDto, CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedException("User is not logged in.");
        }

        var baseQuery = _dbContext.ChatBotSessions
            .Where(x => x.UserId == userId)
            .Select(x => new ChatBotSessionDto
            {
                Title = x.Title,
                Id = x.Id,
                CreatedAt = x.UpdatedAt,
                UpdatedAt = x.UpdatedAt,
                EndDate = x.EndDate,
                Feedback = x.Feedback,
                UserId = x.UserId,
            });
        
        var count = await baseQuery.CountAsync(ct);

        var chatBotSessions = await baseQuery.
            Paginate(filterDto.PageNumber, filterDto.PageSize)
            .ToListAsync(ct);
        
        var result = new PaginatedResponseDto<ChatBotSessionDto>(chatBotSessions, filterDto.PageNumber, filterDto.PageSize, count);
        
        return result;
    }

    public async Task UpdateSessionTitleAsync(Guid sessionId, UpdateTitleDto titleDto, CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedException("User is not logged in.");
        }
        
        var chatBotSession = await _dbContext.ChatBotSessions
            .FirstOrDefaultAsync(x => x.Id == sessionId && x.UserId == userId, ct);
        
        if (chatBotSession == null)
        {
            throw new NotFoundException("Chat bot session not found.");
        }
        
        chatBotSession.Title = titleDto.Title;
        await _dbContext.SaveChangesAsync(ct);
    }
}