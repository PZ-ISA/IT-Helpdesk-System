using HelpdeskSystem.Domain.Dtos.Users;

namespace HelpdeskSystem.Domain.Interfaces;

public interface IUserService
{
    Task<UserDto> GetUserAsync(CancellationToken ct);

    Task ChangePasswordAsync(ChangePasswordDto changePasswordDto, CancellationToken ct);
    
    Task UpdateUserAsync(UpdateUserDto updateUserDto, CancellationToken ct);
}