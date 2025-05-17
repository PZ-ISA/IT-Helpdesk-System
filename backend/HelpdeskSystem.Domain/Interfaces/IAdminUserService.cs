using HelpdeskSystem.Domain.Common;
using HelpdeskSystem.Domain.Dtos.Users;

namespace HelpdeskSystem.Domain.Interfaces;

public interface IAdminUserService
{
    Task<PaginatedResponseDto<UserDto>> GetUsersAsync(PageQueryFilterDto filterDto, bool? isActive, CancellationToken ct);
    Task UpdateUserStatusAsync(UserStatusDto userStatusDto, CancellationToken ct);
}   