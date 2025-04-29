using HelpdeskSystem.Domain.Common;
using HelpdeskSystem.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HelpdeskSystem.Domain.Entities;

public sealed record ChatBotSession : BaseEntity
{
    public Feedback Feedback { get; set; }
    public DateTime? EndDate { get; set; }
    public Guid UserId { get; set; }

    public User? User { get; set; }
    public ICollection<ChatBotMessage>? ChatBotMessages { get; set; }
}

public class ChatBotSessionConfiguration : BaseEntityConfiguration<ChatBotSession>
{
    public override void Configure(EntityTypeBuilder<ChatBotSession> builder)
    {
        base.Configure(builder);
        
        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(x => x.ChatBotMessages)
            .WithOne(c => c.ChatBotSession)
            .HasForeignKey(c => c.ChatBotSessionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}