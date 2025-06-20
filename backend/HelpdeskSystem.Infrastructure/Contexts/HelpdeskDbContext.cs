using HelpdeskSystem.Domain.Common;
using HelpdeskSystem.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HelpdeskSystem.Infrastructure.Contexts;

public class HelpdeskDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    public HelpdeskDbContext(DbContextOptions<HelpdeskDbContext> options) : base(options)
    {
    }

    public DbSet<Ticket> Tickets { get; set; }
    public DbSet<TicketMessage> TicketMessages { get; set; }
    public DbSet<Takeover> Takeovers { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<EmailLog> EmailLogs { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<ChatBotSession> ChatBotSessions { get; set; }
    public DbSet<ChatBotMessage> ChatBotMessages { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        
        builder.ApplyConfigurationsFromAssembly(typeof(BaseEntityConfiguration<>).Assembly);
    }
}