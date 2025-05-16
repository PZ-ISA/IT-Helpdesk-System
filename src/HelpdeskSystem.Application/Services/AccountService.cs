using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HelpdeskSystem.Application.Common;
using HelpdeskSystem.Domain.Dtos.Accounts;
using HelpdeskSystem.Domain.Entities;
using HelpdeskSystem.Domain.Exceptions;
using HelpdeskSystem.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace HelpdeskSystem.Application.Services;

public class AccountService : IAccountService
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;
    private readonly JwtOptions _jwtOptions;
    
    public AccountService(UserManager<User> userManager, JwtOptions jwtOptions, RoleManager<IdentityRole<Guid>> roleManager)
    {
        _userManager = userManager;
        _jwtOptions = jwtOptions;
        _roleManager = roleManager;
    }
    
    public async Task<LoginResponseDto> LoginAsync(LoginDto dto, CancellationToken ct)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
        {
            throw new BadRequestException("Incorrect email or password");
        }
        
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
        var refreshToken = Guid.NewGuid().ToString();
        
        await _userManager.SetAuthenticationTokenAsync(user, "HelpdeskSystem", "RefreshToken", refreshToken);

        return new LoginResponseDto
        {
            Token = tokenHandler.WriteToken(token),
            RefreshToken = refreshToken
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
        
        var role = dto.Role ?? "User";
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
        // var user = _userManager.Users.FirstOrDefault(u => _userManager.GetAuthenticationTokenAsync(u, "HelpdeskSystem", "RefreshToken").Result == dto.RefreshToken);

        var users = _userManager.Users.ToList();

        foreach (var user in users)
        {
            var RefreshToken = await _userManager.GetAuthenticationTokenAsync(user, "HelpdeskSystem", "RefreshToken");

            if (RefreshToken == dto.RefreshToken)
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
                
                var newRefreshToken = Guid.NewGuid().ToString();
                
                await _userManager.SetAuthenticationTokenAsync(user, "HelpdeskSystem", "RefreshToken", newRefreshToken);
                
                return new LoginResponseDto
                {
                    Token = tokenHandler.WriteToken(token),
                    RefreshToken = newRefreshToken
                };
            }
        }
        
        throw new UnauthorizedAccessException("Bad refresh token");
    }
}