using HelpdeskSystem.Domain.Common;
using HelpdeskSystem.Domain.Dtos.Users;

namespace HelpdeskSystem.Domain.Interfaces;

public interface IAdminUserService
{
    Task<PaginatedResponseDto<UserDto>> GetUsersAsync(PageQueryFilterDto filterDto, bool? status, CancellationToken ct);
    Task UpdateUserStatusAsync(UpdateUserStatusDto updateUserStatusDto, Guid id, CancellationToken ct);
}   