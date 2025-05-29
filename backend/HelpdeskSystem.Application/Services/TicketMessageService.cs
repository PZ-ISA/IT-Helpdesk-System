using HelpdeskSystem.Application.Mappers;
using HelpdeskSystem.Application.Utils;
using HelpdeskSystem.Domain.Common;
using HelpdeskSystem.Domain.Dtos.TicketMessages;
using HelpdeskSystem.Domain.Entities;
using HelpdeskSystem.Domain.Enums;
using HelpdeskSystem.Domain.Exceptions;
using HelpdeskSystem.Domain.Interfaces;
using HelpdeskSystem.Infrastructure.Contexts;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SendGrid;
using SendGrid.Helpers.Mail.Model;

namespace HelpdeskSystem.Application.Services;

public class TicketMessageService : ITicketMessageService
{
    private readonly IUserContextService _userContextService;
    private readonly HelpdeskDbContext _dbContext;
    private readonly UserManager<User> _userManager;
    private readonly ISendGridService _sendGridService;
    private readonly TemplateService _templateService;

    public TicketMessageService(IUserContextService userContextService, HelpdeskDbContext dbContext, UserManager<User> userManager, ISendGridService sendGridService, TemplateService templateService)
    {
        _dbContext = dbContext;
        _userContextService = userContextService;
        _userManager = userManager;
        _sendGridService = sendGridService;
        _templateService = templateService;
    }
    
    public async Task<PaginatedResponseDto<TicketMessageDto>> GetTicketMessagesAsync(PageQueryFilterDto filterDto, Guid ticketId, CancellationToken ct)
    {
        var baseQuery = _dbContext.TicketMessages.AsQueryable();
        
        var count = await baseQuery.CountAsync(ct);

        baseQuery = baseQuery.Where(x => x.TicketId == ticketId);
        
        var ticketMessages = await baseQuery
            .Paginate(filterDto.PageNumber, filterDto.PageSize)
            .ToListAsync(ct);

        var items = new List<TicketMessageDto>();

        foreach (var ticketMessage in ticketMessages)
        {
            var ticketMessageDto = TicketMessageMappers.MapToTicketMessageDto(ticketMessage);
            
            items.Add(ticketMessageDto);
        }

        return new PaginatedResponseDto<TicketMessageDto>(items, filterDto.PageNumber, filterDto.PageSize, count);
    }

    public async Task<Guid> CreateTicketMessageAsync(CreateTicketMessageDto createTicketMessageDto, Guid ticketId, CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedException("User is not logged in.");
        }
        
        var user = _dbContext.Users.FirstOrDefault(x => x.Id == userId);
        if (user == null)
        {
            throw new NotFoundException("User not found.");
        }
        
        var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault();
        
        var ticket = await _dbContext.Tickets.FirstOrDefaultAsync(x => x.Id == ticketId, ct);
        if (ticket == null)
        {
            throw new NotFoundException("Ticket not found.");
        }

        if (role == "Admin")
        {
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
            
            await _sendGridService.SendEmailAsync(
                employeeUser.Email,
                "Nowa odpowiedź na Twoje zgłoszenie",
                template
            );
        }
        
        var ticketMessage = new TicketMessage
        {
            Message = createTicketMessageDto.Message,
            TicketId = ticketId,
            UserId = userId.Value
        };
        
        
        
        
        
        await _dbContext.TicketMessages.AddAsync(ticketMessage, ct);
        await _dbContext.SaveChangesAsync(ct);
        
        return ticketMessage.Id;
    }
}