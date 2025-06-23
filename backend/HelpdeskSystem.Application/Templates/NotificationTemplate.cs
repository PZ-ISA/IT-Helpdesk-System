using HelpdeskSystem.Domain.Dtos.Notification;

namespace HelpdeskSystem.Application.Templates;

public static class NotificationTemplate
{
    public static NotificationDto CreateNotificationDto(string messageContent, Guid receiverUserId, DateTimeOffset timestampUtc)
    {
        return new NotificationDto
        {
            Id = Guid.NewGuid(),
            Title = "Nowa wiadomość w tickecie",
            Content = messageContent,
            Seen = false,
            UserId = receiverUserId,
            CreatedAt = timestampUtc,
            UpdatedAt = timestampUtc
        };
    }
}