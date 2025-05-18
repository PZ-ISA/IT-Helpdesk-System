using HelpdeskSystem.Application.Mappers;
using HelpdeskSystem.Application.Utils;
using HelpdeskSystem.Domain.Common;
using HelpdeskSystem.Domain.Dtos.Users;
using HelpdeskSystem.Domain.Entities;
using HelpdeskSystem.Domain.Exceptions;
using HelpdeskSystem.Domain.Interfaces;
using HelpdeskSystem.Infrastructure.Contexts;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HelpdeskSystem.Application.Services;

public class AdminUserService : IAdminUserService
{
    private readonly UserManager<User> _userManager;
    private readonly IUserContextService _userContextService;
    private readonly HelpdeskDbContext _context;

    public AdminUserService(UserManager<User> userManager, IUserContextService userContextService, HelpdeskDbContext context)
    {
        _userManager = userManager;
        _userContextService = userContextService;
        _context = context;
    }


    public async Task<PaginatedResponseDto<UserDto>> GetUsersAsync(PageQueryFilterDto filterDto, bool? isActive, CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedException("User is not logged in.");
        }

        var baseQuery = _context.Users.AsQueryable();

        var count = await baseQuery.CountAsync(ct);
        
        if (isActive.HasValue)
        {
            baseQuery = baseQuery.Where(x => x.IsActive == isActive.Value);
        }

        var items = await baseQuery
            .Select(x => UserMappers.MapToUserDto(x))
            .Paginate(filterDto.PageNumber, filterDto.PageSize)
            .ToListAsync(ct);

        var result = new PaginatedResponseDto<UserDto>(items, filterDto.PageNumber, filterDto.PageSize, count);

        return result;
    }
    
    public async Task UpdateUserStatusAsync(UserStatusDto userStatusDto, CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedException("User is not logged in.");
        }

        var user = await _userManager.FindByIdAsync(userStatusDto.Id.ToString());
        if (user == null)
        {
            throw new NotFoundException("User not found.");
        }

        user.IsActive = userStatusDto.IsActive;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            throw new BadRequestException("Failed to update user.");
        }
    }

}