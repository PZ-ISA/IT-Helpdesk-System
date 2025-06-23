using HelpdeskSystem.Application.Common;
using HelpdeskSystem.Application.Mappers;
using HelpdeskSystem.Application.Utils;
using HelpdeskSystem.Domain.Common;
using HelpdeskSystem.Domain.Dtos.TicketMessages;
using HelpdeskSystem.Domain.Entities;
using HelpdeskSystem.Domain.Exceptions;
using HelpdeskSystem.Domain.Hubs;
using HelpdeskSystem.Domain.Interfaces;
using HelpdeskSystem.Infrastructure.Contexts;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using HelpdeskSystem.Application.Templates;

namespace HelpdeskSystem.Application.Services;

public class TicketMessageService : ITicketMessageService
{
    private readonly IUserContextService _userContextService;
    private readonly HelpdeskDbContext _dbContext;
    private readonly UserManager<User> _userManager;
    private readonly ISendGridService _sendGridService;
    private readonly TemplateService _templateService;
    private readonly IHubContext<NotificationHub, INotificationClient> _hubContext;
    private readonly TimeProvider _timeProvider;

    public TicketMessageService(IUserContextService userContextService, HelpdeskDbContext dbContext, UserManager<User> userManager, ISendGridService sendGridService, TemplateService templateService, IHubContext<NotificationHub, INotificationClient> hubContext, TimeProvider timeProvider)
    {
        _dbContext = dbContext;
        _userContextService = userContextService;
        _userManager = userManager;
        _sendGridService = sendGridService;
        _templateService = templateService;
        _hubContext = hubContext;
        _timeProvider = timeProvider;
    }
    
    public async Task<PaginatedResponseDto<TicketMessageDto>> GetTicketMessagesAsync(PageQueryFilterDto filterDto, Guid ticketId, CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedException("User is not logged in.");
        }
        
        var ticket = await _dbContext.Tickets
            .Include(x => x.TicketMessages)
            .FirstOrDefaultAsync(x => x.Id == ticketId, ct);
        
        if (ticket is null)
        {
            throw new NotFoundException("Ticket not found.");
        }
        
        if (ticket.AdminUserId != userId && ticket.EmployeeUserId != userId)
        {
            throw new ForbidException("Insufficient permissions to access this ticket.");
        }
        
        var count = ticket.TicketMessages.Count;
        
        var items = ticket.TicketMessages
            .Select(TicketMessageMappers.MapToTicketMessageDto)
            .Paginate(filterDto.PageNumber, filterDto.PageSize)
            .ToList();
        
        return new PaginatedResponseDto<TicketMessageDto>(items, filterDto.PageNumber, filterDto.PageSize, count);
    }

    public async Task CreateTicketMessageAsync(CreateTicketMessageDto createTicketMessageDto, Guid ticketId, CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedException("User is not logged in.");
        }
        
        var user = await _dbContext.Users.FirstAsync(x => x.Id == userId, ct);
        
        var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault();
        
        var ticket = await _dbContext.Tickets
            .Include(x => x.TicketMessages)
            .FirstOrDefaultAsync(x => x.Id == ticketId, ct);
        
        if (ticket == null)
        {
            throw new NotFoundException("Ticket not found.");
        }
        
        if (ticket.AdminUserId != userId && ticket.EmployeeUserId != userId)
        {
            throw new ForbidException("Insufficient permissions to access this ticket.");
        }

        Guid receiverUserId;
        
        if (role == "Admin")
        {
            receiverUserId = ticket.EmployeeUserId;
            
            var employeeUserId = ticket.EmployeeUserId;
            
            var employeeUser = _dbContext.Users.FirstOrDefault(x => x.Id == employeeUserId);
            if (employeeUser == null)
            {
                throw new NotFoundException("Employee not found.");
            }
            
            var variables = new Dictionary<string, string>
            {
                { "UserName", employeeUser.Name },
                { "TicketTitle", ticket.Title },
                { "MessageContent", createTicketMessageDto.Message }
            };

            var template = _templateService.LoadTemplate("ReplyNotification", variables);
            
            var subject = $"{SendGridConstants.EmailSubjectTemplate}{ticket.Title}";
            
            await _sendGridService.SendEmailAsync(
                employeeUser.Email,
                subject,
                template
            );
        }
        
        receiverUserId = ticket.AdminUserId.Value;
        
        var notificationDto = NotificationTemplate.CreateNotificationDto(createTicketMessageDto.Message, receiverUserId, _timeProvider.GetUtcNow());

        await _hubContext.Clients.User(receiverUserId.ToString()!).SendNotificationAsync(notificationDto);

        ticket.TicketMessages.Add(new TicketMessage
        {
            Message = createTicketMessageDto.Message,
            TicketId = ticketId,
            UserId = userId.Value
        });
        
        await _dbContext.SaveChangesAsync(ct);
    }
}