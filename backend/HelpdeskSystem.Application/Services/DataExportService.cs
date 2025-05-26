using HelpdeskSystem.Domain.Dtos.ExportData;
using HelpdeskSystem.Domain.Entities;
using HelpdeskSystem.Domain.Enums;
using HelpdeskSystem.Domain.Interfaces;
using HelpdeskSystem.Infrastructure.Contexts;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HelpdeskSystem.Application.Services;

public class DataExportService : IDataExportService
{
    private readonly HelpdeskDbContext _dbContext;
    private readonly UserManager<User> _userManager;
    
    public DataExportService(HelpdeskDbContext dbContext, UserManager<User> userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }
    
    public async Task<ICollection<ExportTicketDto>> ExportTicketsDataAsync(CancellationToken ct)
    {
        var tickets = await _dbContext.Tickets
            .Include(t => t.TicketMessages)
            .ThenInclude(m => m.User)
            .Where(t => t.TicketMessages.Any() && t.Status == TicketStatus.Closed && t.Feedback != null)
            .ToListAsync(ct);

        var result = new List<ExportTicketDto>();

        foreach (var t in tickets)
        {
            var exportMessages = new List<ExportTicketMessageDto>();

            foreach (var m in t.TicketMessages)
            {
                var roles = await _userManager.GetRolesAsync(m.User);
                var senderRole = roles.FirstOrDefault() ?? "Unknown";

                exportMessages.Add(new ExportTicketMessageDto
                {
                    Sender = senderRole,
                    Message = m.Message,
                    CreatedAt = m.CreatedAt
                });
            }

            result.Add(new ExportTicketDto
            {
                TicketId = t.Id,
                Title = t.Title,
                Description = t.Description,
                Messages = exportMessages,
                Feedback = t.Feedback.ToString()!,
            });
        }

        return result;
    }

    public async Task<ICollection<ExportChatDto>> ExportChatDataAsync(CancellationToken ct)
    {
        var data = await _dbContext.ChatBotSessions
            .Include(c => c.ChatBotMessages)
            .Where(c => c.ChatBotMessages != null && c.ChatBotMessages.Count > 0 && c.Feedback != null)
            .Select(c => new ExportChatDto
            {
                Id = c.Id,
                Title = c.Title,
                CreatedAt = c.CreatedAt,
                Feedback = c.Feedback.ToString()!,
                Messages = c.ChatBotMessages
                    .Select(m => new ExportChatMessageDto
                    {
                        IsUserMessage = m.IsUserMessage,
                        Message = m.Message,
                        CreatedAt = m.CreatedAt
                    })
                    .ToList()
            })
            .ToListAsync(ct);

        return data;
    }
}