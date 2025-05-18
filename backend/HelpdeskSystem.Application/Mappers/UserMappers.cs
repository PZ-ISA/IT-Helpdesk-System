using HelpdeskSystem.Domain.Dtos.Users;
using HelpdeskSystem.Domain.Entities;

namespace HelpdeskSystem.Application.Mappers;

public static class UserMappers
{
    public static UserDto MapToUserDto(User user)
    {
        var userDto = new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Surname = user.Surname,
            Email = user.Email!,
            IsActive = user.IsActive
        };
        
        return userDto;
    }
}