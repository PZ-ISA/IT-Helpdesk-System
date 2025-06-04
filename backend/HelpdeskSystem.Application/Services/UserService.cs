using HelpdeskSystem.Application.Mappers;
using HelpdeskSystem.Domain.Dtos.Users;
using HelpdeskSystem.Domain.Entities;
using HelpdeskSystem.Domain.Exceptions;
using HelpdeskSystem.Domain.Interfaces;
using HelpdeskSystem.Infrastructure.Contexts;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HelpdeskSystem.Application.Services;

public class UserService : IUserService
{
    private readonly UserManager<User> _userManager;
    private readonly IUserContextService _userContextService;
    private readonly HelpdeskDbContext _dbContext;
    
    public UserService(UserManager<User> userManager, HelpdeskDbContext dbContext, IUserContextService userContextService)
    {
        _userManager = userManager;
        _dbContext = dbContext;
        _userContextService = userContextService;
    }
    
    public async Task<UserDto> GetUserAsync(CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedException("User is not logged in.");
        }
        
        var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == userId, ct);
        if (user == null)
        {
            throw new UnauthorizedException("User not found.");
        }

        var userDto = UserMappers.MapToUserDto(user);

        var roles = await _userManager.GetRolesAsync(user);

        userDto.Role = roles.ToList()[0];
        
        return userDto;
    }


    public async Task ChangePasswordAsync(ChangePasswordDto changePasswordDto, CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedException("User is not logged in.");
        }
        
        var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == userId, ct);
        if (user == null)
        {
            throw new UnauthorizedException("User not found.");
        }
        
        var result = await _userManager.ChangePasswordAsync(user, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);

        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new BadRequestException(errors);
        }
    }

    public async Task UpdateUserAsync(UpdateUserDto updateUserDto, CancellationToken ct)
    {
        var userId = _userContextService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UnauthorizedException("User is not logged in.");
        }

        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId, ct);
        if (user == null)
        {
            throw new UnauthorizedException("User not found.");
        }

        var existingUser = await _userManager.FindByEmailAsync(updateUserDto.Email);
        if (existingUser is not null && existingUser.Id != userId)
        {
            throw new BadRequestException("Email address is already in use.");
        }
        
        user.Name = updateUserDto.Name;
        user.Surname = updateUserDto.Surname;
        user.UserName = updateUserDto.Email;
        user.NormalizedUserName = _userManager.NormalizeEmail(updateUserDto.Email);
        user.Email = updateUserDto.Email;
        user.NormalizedEmail = _userManager.NormalizeEmail(updateUserDto.Email);
        
        await _dbContext.SaveChangesAsync(ct);
    }
}