using HelpdeskSystem.Application.Mappers;
using HelpdeskSystem.Application.Utils;
using HelpdeskSystem.Domain.Common;
using HelpdeskSystem.Domain.Dtos.Common;
using HelpdeskSystem.Domain.Dtos.Tickets;
using HelpdeskSystem.Domain.Entities;
using HelpdeskSystem.Domain.Enums;
using HelpdeskSystem.Domain.Exceptions;
using HelpdeskSystem.Domain.Interfaces;
using HelpdeskSystem.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace HelpdeskSystem.Application.Services;

public class TicketService : ITicketService
{
    private readonly IUserContextService _userContextService;
    private readonly HelpdeskDbContext _dbContext;
    private readonly TimeProvider _timeProvider;
    
    public TicketService(IUserContextService userContextService, HelpdeskDbContext dbContext, TimeProvider timeProvider)
    {
        _userContextService = userContextService;
        _dbContext = dbContext;
        _timeProvider = timeProvider;
    }
    
    public async Task<Guid> CreateTicketAsync(CreateTicketDto dto, CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedException("User is not logged in.");
        }

        var ticket = new Ticket
        {
            Title = dto.Title,
            Description = dto.Description,
            EmployeeUserId = userId.Value,
            Status = TicketStatus.New
        };
        
        await _dbContext.Tickets.AddAsync(ticket, ct);
        await _dbContext.SaveChangesAsync(ct);
        
        return ticket.Id;
    }

    public async Task<TicketDto> GetTicketByIdAsync(Guid id, CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedException("User is not logged in.");
        }

        var ticket = await _dbContext.Tickets
            .FirstOrDefaultAsync(x => x.Id == id && x.EmployeeUserId == userId, ct);

        if (ticket == null)
        {
            throw new NotFoundException("Ticket not found.");
        }

        var ticketDto = TicketMappers.MapToTicketDto(ticket);

        return ticketDto;
    }

    public async Task<PaginatedResponseDto<TicketDto>> GetTicketsAsync(PageQueryFilterDto filterDto, CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedException("User is not logged in.");
        }

        var baseQuery = _dbContext.Tickets
            .Where(x => x.EmployeeUserId == userId);
        
        var count = await baseQuery.CountAsync(ct);

        var items = await baseQuery
            .Select(x => TicketMappers.MapToTicketDto(x))
            .Paginate(filterDto.PageNumber, filterDto.PageSize)
            .ToListAsync(ct);
        
        var result = new PaginatedResponseDto<TicketDto>(items, filterDto.PageNumber, filterDto.PageSize, count);
        
        return result;
    }

    public async Task UpdateTicketAsync(CreateTicketDto dto, Guid id, CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedException("User is not logged in.");
        }

        var ticket = await _dbContext.Tickets
            .FirstOrDefaultAsync(x => x.Id == id && x.EmployeeUserId == userId, ct);

        if (ticket == null)
        {
            throw new NotFoundException("Ticket not found.");
        }

        if (ticket.Status == TicketStatus.Closed)
        {
            throw new BadRequestException("Can not update closed ticket");
        }
        
        ticket.Title = dto.Title;
        ticket.Description = dto.Description;
        ticket.UpdatedAt = _timeProvider.GetUtcNow();
        
        await _dbContext.SaveChangesAsync(ct);
    }

    public async Task DeleteTicketAsync(Guid id, CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedException("User is not logged in.");
        }

        var ticket = await _dbContext.Tickets
            .FirstOrDefaultAsync(x => x.Id == id && x.EmployeeUserId == userId, ct);

        if (ticket == null)
        {
            throw new NotFoundException("Ticket not found.");
        }    
        
        _dbContext.Tickets.Remove(ticket);
        await _dbContext.SaveChangesAsync(ct);
    }

    public async Task AddFeedbackAsync(Guid id, FeedbackDto dto, CancellationToken ct)
    {
        var ticket = await _dbContext.Tickets
            .FirstOrDefaultAsync(t => t.Id == id, ct);

        if (ticket is null)
        {
            throw new NotFoundException("Ticket not found");
        }

        if (ticket.Status != TicketStatus.Closed)
        {
            throw new BadRequestException("Can not add a feedback to open ticket");
        }

        ticket.Feedback = dto.Feedback;
        ticket.UpdatedAt = _timeProvider.GetUtcNow();

        await _dbContext.SaveChangesAsync(ct);
    }
}