using HelpdeskSystem.Application.Common;
using HelpdeskSystem.Domain.Dtos.Accounts;
using HelpdeskSystem.Domain.Entities;
using HelpdeskSystem.Domain.Interfaces;
using HelpdeskSystem.Infrastructure.Contexts;
using Microsoft.AspNetCore.Identity;

namespace HelpdeskSystem.Application.Services;

public class AccountService : IAccountService
{
    private readonly UserManager<User> _userManager;
    private readonly JwtOptions _jwtOptions;
    
    public AccountService(UserManager<User> userManager, JwtOptions jwtOptions)
    {
        _userManager = userManager;
        _jwtOptions = jwtOptions;
    }
    
    public Task<string> LoginAsync(LoginDto dto, CancellationToken ct)
    {
        throw new NotImplementedException();
    }

    public async Task RegisterAsync(RegisterDto dto, CancellationToken ct)
    {
        if(await _userManager.FindByEmailAsync(dto.Email) is not null)
            return;

        var user = new User
        {
            Email = dto.Email,
            UserName = dto.Email,
            Name = dto.Name,
            Surname = dto.Surname,
            IsActive = false,
        };
        
        var result = await _userManager.CreateAsync(user, dto.Password);
        
        var role = dto.Role ?? "User";
        await _userManager.AddToRoleAsync(user, role);
    }
}