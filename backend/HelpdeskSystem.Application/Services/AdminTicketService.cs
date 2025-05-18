using HelpdeskSystem.Application.Mappers;
using HelpdeskSystem.Application.Utils;
using HelpdeskSystem.Domain.Common;
using HelpdeskSystem.Domain.Dtos.Tickets;
using HelpdeskSystem.Domain.Entities;
using HelpdeskSystem.Domain.Enums;
using HelpdeskSystem.Domain.Exceptions;
using HelpdeskSystem.Domain.Interfaces;
using HelpdeskSystem.Infrastructure.Contexts;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HelpdeskSystem.Application.Services;

public class AdminTicketService : IAdminTicketService
{
    private readonly UserManager<User> _userManager;
    private readonly IUserContextService _userContextService;
    private readonly HelpdeskDbContext _context;

    public AdminTicketService(UserManager<User> userManager, IUserContextService userContextService, HelpdeskDbContext context)
    {
        _userManager = userManager;
        _userContextService = userContextService;
        _context = context;
    }


    public async Task<PaginatedResponseDto<TicketDto>> GetTicketsAsync(PageQueryFilterDto filterDto, TicketStatus status, CancellationToken ct)
    {
        var baseQuery = _context.Tickets.AsQueryable();

        var count = await baseQuery.CountAsync(ct);

        var items = await baseQuery
            .Where(x => x.Status == status)
            .Select(x => TicketMappers.MapToTicketDto(x))
            .Paginate(filterDto.PageNumber, filterDto.PageSize)
            .ToListAsync(ct);

        var result = new PaginatedResponseDto<TicketDto>(items, filterDto.PageNumber, filterDto.PageSize, count);

        return result;
    }

    public async Task<TicketDto> GetTicketByIdAsync(Guid id, CancellationToken ct)
    {
        var ticket = await _context.Tickets
            .FirstOrDefaultAsync(x => x.Id == id, ct);

        if (ticket == null)
        {
            throw new NotFoundException("Ticket not found.");
        }

        var ticketDto = TicketMappers.MapToTicketDto(ticket);

        return ticketDto;
    }

    
    public async Task UpdateTicketEmployeeAsync(UpdateTicketEmployeeDto updateTicketEmployeeDto, Guid id, CancellationToken ct)
    {

        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedException("User is not logged in.");
        }

        var ticket = await _context.Tickets
            .FirstOrDefaultAsync(x => x.Id == id, ct);

        if (ticket == null)
        {
            throw new NotFoundException("Ticket not found.");
        }

        if (ticket.Status == TicketStatus.Closed)
        {
            throw new BadRequestException("Can not update closed ticket");
        }
        
        ticket.EmployeeUserId = updateTicketEmployeeDto.EmployeeUserId;
        
        await _context.SaveChangesAsync(ct);
    }
}