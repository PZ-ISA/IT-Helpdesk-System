namespace HelpdeskSystem.Domain.Dtos.Takeover;

public record TakeoverDto
{
    public required Guid Id { get; set; }
    public required Guid AdminUserId { get; set; }
}