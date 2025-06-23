using System.Security.Claims;
using HelpdeskSystem.Domain.Dtos.Notification;
using HelpdeskSystem.Domain.Exceptions;
using HelpdeskSystem.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace HelpdeskSystem.Domain.Hubs;

public interface INotificationClient
{
    Task SendNotificationAsync(NotificationDto notificationDto);
}

public sealed class NotificationHub : Hub<INotificationClient>
{
    
}