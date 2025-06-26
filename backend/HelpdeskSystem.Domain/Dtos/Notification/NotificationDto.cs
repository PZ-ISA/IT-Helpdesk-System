namespace HelpdeskSystem.Domain.Dtos.Notification;

public sealed record NotificationDto
{
    public required Guid Id { get; set; }
    public required string Title { get; set; }
    public string? Content { get; set; }
    public required bool Seen { get; set; }
    public required Guid UserId { get; set; }
    public required DateTimeOffset CreatedAt { get; set; }
    public required DateTimeOffset UpdatedAt { get; set; }
}