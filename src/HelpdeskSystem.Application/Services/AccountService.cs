using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HelpdeskSystem.Application.Common;
using HelpdeskSystem.Domain.Dtos.Accounts;
using HelpdeskSystem.Domain.Entities;
using HelpdeskSystem.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

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
    
    public async Task<string> LoginAsync(LoginDto dto, CancellationToken ct)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
        {
            return null;
        }
        
        var roles = await _userManager.GetRolesAsync(user);
        
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Secret));

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, $"{user.Email}"),
        };

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(60),
            Issuer = _jwtOptions.Issuer,
            Audience = _jwtOptions.Audience,
            SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        
        return tokenHandler.WriteToken(token);
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