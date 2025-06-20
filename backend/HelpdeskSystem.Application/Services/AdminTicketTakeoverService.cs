using HelpdeskSystem.Application.Mappers;
using HelpdeskSystem.Application.Utils;
using HelpdeskSystem.Domain.Common;
using HelpdeskSystem.Domain.Dtos.Takeover;
using HelpdeskSystem.Domain.Entities;
using HelpdeskSystem.Domain.Enums;
using HelpdeskSystem.Domain.Exceptions;
using HelpdeskSystem.Domain.Interfaces;
using HelpdeskSystem.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace HelpdeskSystem.Application.Services;

public class AdminTicketTakeoverService : IAdminTicketTakeoverService
{
    private readonly IUserContextService _userContextService;
    private readonly HelpdeskDbContext _dbContext;

    public AdminTicketTakeoverService(IUserContextService userContextService, HelpdeskDbContext dbContext)
    {
        _userContextService = userContextService;
        _dbContext = dbContext;
    }
    
    public async Task<PaginatedResponseDto<TakeoverDto>> GetIncomingTakeoversAsync(PageQueryFilterDto filterDto, CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedAccessException("User is not logged in.");
        }

        var baseQuery = _dbContext.Takeovers
            .Include(x => x.Ticket)
            .Where(x => x.Ticket.AdminUserId == userId);
        
        var count = await baseQuery.CountAsync(ct);
        
        var items = await baseQuery
            .Select(x => TakeoverMappers.MapToTakeoverDto(x))
            .Paginate(filterDto.PageNumber, filterDto.PageSize)
            .ToListAsync(ct);
        
        var result = new PaginatedResponseDto<TakeoverDto>(items, filterDto.PageNumber, filterDto.PageSize, count);
        
        return result;
    }

    public async Task<PaginatedResponseDto<TakeoverDto>> GetOutgoingTakeoversAsync(PageQueryFilterDto filterDto, CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedAccessException("User is not logged in.");
        }

        var baseQuery = _dbContext.Takeovers
            .Where(x => x.AdminUserId == userId);
        
        var count = await baseQuery.CountAsync(ct);
        
        var items = await baseQuery
            .Select(x => TakeoverMappers.MapToTakeoverDto(x))
            .Paginate(filterDto.PageNumber, filterDto.PageSize)
            .ToListAsync(ct);
        
        var result = new PaginatedResponseDto<TakeoverDto>(items, filterDto.PageNumber, filterDto.PageSize, count);
        
        return result;
    }

    public async Task DecideOnTakeoverRequestAsync(Guid takeoverId, TakeoverDecisionDto takeoverDecisionDto, CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedAccessException("User is not logged in.");
        }
        
        var takeover = await _dbContext.Takeovers.Include(x => x.Ticket).FirstOrDefaultAsync(x => x.Id == takeoverId, ct);
        if (takeover == null)
        {
            throw new NotFoundException("Takeover not found.");
        }

        if (takeover.Ticket.AdminUserId != userId)
        {
            throw new ForbidException("You are not allowed to decide on this takeover request.");
        }

        if (takeoverDecisionDto.Decision == true)
        {
            takeover.Ticket.AdminUserId = takeover.AdminUserId;
        }
        
        _dbContext.Takeovers.Remove(takeover);
        await _dbContext.SaveChangesAsync(ct);
    }
    
    public async Task CreateTakeoverRequestAsync(Guid id, CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedAccessException("User is not logged in.");
        }
        
        var ticket = _dbContext.Tickets.FirstOrDefault(x => x.Id == id);
        if (ticket == null)
        {
            throw new NotFoundException("Ticket not found.");
        }

        if (ticket.AdminUserId == null)
        {
            throw new BadRequestException("Ticket has no admin user assigned.");
        }

        if (ticket.AdminUserId == userId)
        {
            throw new BadRequestException("You are already assigned to this ticket.");
        }

        if (ticket.Status == TicketStatus.Closed)
        {
            throw new BadRequestException("Ticket is closed.");
        }
        
        var takeover = new Takeover
        {
            AdminUserId = userId.Value,
            TicketId = id
        };
        
        await _dbContext.Takeovers.AddAsync(takeover, ct);
        await _dbContext.SaveChangesAsync(ct);
    }

    public async Task DeleteTakeoverRequestAsync(Guid id, CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedAccessException("User is not logged in.");
        }
        
        var takeover = await _dbContext.Takeovers.FirstOrDefaultAsync(x => x.Id == id, ct);

        if (takeover == null)
        {
            throw new NotFoundException("Ticket takeover not found.");
        }

        if (takeover.AdminUserId != userId)
        {
            throw new ForbidException("You are not allowed to delete this ticket.");
        }
        
        _dbContext.Takeovers.Remove(takeover);
        await _dbContext.SaveChangesAsync(ct);
    }
}