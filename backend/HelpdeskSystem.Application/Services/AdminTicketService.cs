using HelpdeskSystem.Application.Mappers;
using HelpdeskSystem.Application.Utils;
using HelpdeskSystem.Domain.Common;
using HelpdeskSystem.Domain.Dtos.Tickets;
using HelpdeskSystem.Domain.Enums;
using HelpdeskSystem.Domain.Exceptions;
using HelpdeskSystem.Domain.Interfaces;
using HelpdeskSystem.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace HelpdeskSystem.Application.Services;

public class AdminTicketService : IAdminTicketService
{
    private readonly IUserContextService _userContextService;
    private readonly HelpdeskDbContext _dbContext;

    public AdminTicketService(IUserContextService userContextService, HelpdeskDbContext dbContext)
    {
        _userContextService = userContextService;
        _dbContext = dbContext;
    }


    public async Task<PaginatedResponseDto<TicketDto>> GetTicketsAsync(PageQueryFilterDto filterDto, TicketStatus? status, CancellationToken ct)
    {
        var baseQuery = _dbContext.Tickets.AsQueryable();

        var count = await baseQuery.CountAsync(ct);

        if (status.HasValue)
        {
            baseQuery = baseQuery.Where(x => x.Status == status.Value);
        }

        var items = await baseQuery
            .Select(x => TicketMappers.MapToTicketDto(x))
            .Paginate(filterDto.PageNumber, filterDto.PageSize)
            .ToListAsync(ct);

        var result = new PaginatedResponseDto<TicketDto>(items, filterDto.PageNumber, filterDto.PageSize, count);

        return result;
    }

    public async Task<TicketDto> GetTicketByIdAsync(Guid id, CancellationToken ct)
    {
        var ticket = await _dbContext.Tickets.FirstOrDefaultAsync(x => x.Id == id, ct);

        if (ticket == null)
        {
            throw new NotFoundException("Ticket not found.");
        }

        var ticketDto = TicketMappers.MapToTicketDto(ticket);

        return ticketDto;
    }

    
    public async Task AssignAdminToTicketAsync(Guid id, CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedException("User is not logged in.");
        }

        var ticket = await _dbContext.Tickets.FirstOrDefaultAsync(x => x.Id == id, ct);

        if (ticket == null)
        {
            throw new NotFoundException("Ticket not found.");
        }

        if (ticket.Status == TicketStatus.New)
        {
            ticket.EmployeeUserId = userId.Value;
            
            ticket.Status = TicketStatus.Active;
        }
        else
        {
            throw new BadRequestException("Can not assign admin to this ticket");
        }
        
        await _dbContext.SaveChangesAsync(ct);
    }

    public async Task CloseTicketAsync(Guid id, CancellationToken ct)
    {
        var ticket = await _dbContext.Tickets.FirstOrDefaultAsync(x => x.Id == id, ct);
        
        if (ticket == null)
        {
            throw new NotFoundException("Ticket not found.");
        }

        if (ticket.Status == TicketStatus.Active)
        {
            ticket.Status = TicketStatus.Closed;
        }
        
        await _dbContext.SaveChangesAsync(ct);
    }
}