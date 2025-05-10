using Microsoft.AspNetCore.Identity;

namespace HelpdeskSystem.Domain.Entities;

public sealed class User : IdentityUser<Guid>
{
    public required string Name { get; set; }
    public required string Surname { get; set; }
    public bool IsActive { get; set; }
}