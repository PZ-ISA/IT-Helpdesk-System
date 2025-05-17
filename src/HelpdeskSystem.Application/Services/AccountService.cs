using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using HelpdeskSystem.Application.Common;
using HelpdeskSystem.Domain.Dtos.Accounts;
using HelpdeskSystem.Domain.Entities;
using HelpdeskSystem.Domain.Exceptions;
using HelpdeskSystem.Domain.Interfaces;
using HelpdeskSystem.Infrastructure.Contexts;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;


namespace HelpdeskSystem.Application.Services;

public class AccountService : IAccountService
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;
    private readonly JwtOptions _jwtOptions;
    private readonly HelpdeskDbContext _context;
    
    private static string GenerateRefreshToken()
    {
        var bytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(bytes);
        return Convert.ToBase64String(bytes);
    }

    private async Task<string> GenerateToken(User user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Secret));

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, $"{user.Email}"),
            new("IsActive", user.IsActive.ToString())
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
    
    public AccountService(UserManager<User> userManager, JwtOptions jwtOptions, RoleManager<IdentityRole<Guid>> roleManager, HelpdeskDbContext context)
    {
        _userManager = userManager;
        _jwtOptions = jwtOptions;
        _roleManager = roleManager;
        _context = context;
    }
    
    public async Task<LoginResponseDto> LoginAsync(LoginDto dto, CancellationToken ct)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
        {
            throw new BadRequestException("Incorrect email or password");
        }
        
        var refreshToken = new RefreshToken
        {
            Token = GenerateRefreshToken(),
            UserId = user.Id
        };
        
        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync(ct);
        
        return new LoginResponseDto
        {
            Token = await GenerateToken(user),
            RefreshToken = refreshToken.Token
        };
    }

    public async Task RegisterAsync(RegisterDto dto, CancellationToken ct)
    {
        if (await _userManager.FindByEmailAsync(dto.Email) is not null)
        {
            throw new BadRequestException("Email is already taken");
        }

        var user = new User
        {
            Email = dto.Email,
            UserName = dto.Email,
            Name = dto.Name,
            Surname = dto.Surname,
            IsActive = false,
        };
        
        var role = dto.Role ?? "Employee";
        if (!await _roleManager.RoleExistsAsync(role))
        {
            throw new BadRequestException($"Role '{role}' does not exist.");
        }
        
        var result = await _userManager.CreateAsync(user, dto.Password);
        
        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new BadRequestException(errors);
        }
        
        await _userManager.AddToRoleAsync(user, role);
    }

    public async Task<LoginResponseDto> RefreshTokenAsync(RefreshTokenRequestDto dto, CancellationToken ct)
    {
        var refreshToken = await _context.RefreshTokens.Include(rt => rt.User).FirstOrDefaultAsync(rt => rt.Token == dto.RefreshToken, ct);

        if (refreshToken == null || refreshToken.IsRevoked || refreshToken.ExpiresAt <= DateTime.UtcNow)
        {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }
        
        var user = refreshToken.User;

        if (user == null || !user.IsActive)
        {
            throw new BadRequestException("Invalid User for this refresh token");
        }
        
        refreshToken.IsRevoked = true;
        
        var newRefreshToken = new RefreshToken
        {
            Token = GenerateRefreshToken(),
            UserId = user.Id
        };
        
        _context.RefreshTokens.Add(newRefreshToken);
        await _context.SaveChangesAsync(ct);
        
        return new LoginResponseDto
        {
            Token = await GenerateToken(user),
            RefreshToken = newRefreshToken.Token
        };
    }
}