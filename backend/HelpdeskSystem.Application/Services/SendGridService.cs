using HelpdeskSystem.Application.Common;
using HelpdeskSystem.Domain.Entities;
using HelpdeskSystem.Domain.Interfaces;
using HelpdeskSystem.Infrastructure.Contexts;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace HelpdeskSystem.Application.Services;

public class SendGridService : ISendGridService
{
    private readonly SendGridClient _client;
    private readonly HelpdeskDbContext _dbContext;
    
    public SendGridService(IConfiguration configuration, HelpdeskDbContext dbContext)
    {
        _dbContext = dbContext;
        var apiKey = configuration["SendGridApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
            throw new InvalidOperationException("SendGridApiKey is missing in configuration.");
        
        _client = new SendGridClient(apiKey);
    }
    
    public async Task SendEmailAsync(string toEmail, string subject, string htmlContent)
    {
        var emailSubject = SendGridConstants.EmailSubjectTemplate + subject;
        
        var msg = new SendGridMessage
        {
            From = new EmailAddress(SendGridConstants.SendGridEmail, SendGridConstants.SendGridUsername),
            Subject = emailSubject,
            HtmlContent = htmlContent,
        };
        msg.AddTo(new EmailAddress(toEmail));
        
        var response = await _client.SendEmailAsync(msg);

        var emailLog = new EmailLog
        {
            Email = toEmail,
            Title = emailSubject,
            Content = htmlContent,
            IsSuccess = response.IsSuccessStatusCode,
        };
        
        await _dbContext.EmailLogs.AddAsync(emailLog);
        await _dbContext.SaveChangesAsync();
    }
}