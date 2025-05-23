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
    private readonly HelpdeskDbContext _dbContext;

    public AdminUserService(UserManager<User> userManager, HelpdeskDbContext dbContext)
    {
        _userManager = userManager;
        _dbContext = dbContext;
    }
    
    public async Task<PaginatedResponseDto<UserDto>> GetUsersAsync(PageQueryFilterDto filterDto, bool? status, CancellationToken ct)
    {
        var baseQuery = _dbContext.Users.AsQueryable();

        var count = await baseQuery.CountAsync(ct);
        
        if (status.HasValue)
        {
            baseQuery = baseQuery.Where(x => x.IsActive == status.Value);
        }

        var items = await baseQuery
            .Select(x => UserMappers.MapToUserDto(x))
            .Paginate(filterDto.PageNumber, filterDto.PageSize)
            .ToListAsync(ct);

        var result = new PaginatedResponseDto<UserDto>(items, filterDto.PageNumber, filterDto.PageSize, count);

        return result;
    }
    
    public async Task UpdateUserStatusAsync(UpdateUserStatusDto updateUserStatusDto, Guid id, CancellationToken ct)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null)
        {
            throw new NotFoundException("User not found.");
        }

        user.IsActive = updateUserStatusDto.IsActive;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            throw new BadRequestException("Failed to update user.");
        }
    }

}