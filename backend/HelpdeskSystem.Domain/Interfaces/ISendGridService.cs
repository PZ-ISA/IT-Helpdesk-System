namespace HelpdeskSystem.Domain.Interfaces;

public interface ISendGridService
{
    Task SendEmailAsync(string toEmail, string subject, string message);
}