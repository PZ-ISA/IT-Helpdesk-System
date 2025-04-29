using HelpdeskSystem.Domain.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HelpdeskSystem.Domain.Entities;

public sealed record Notification : BaseEntity
{
    public required string Title { get; set; }
    public string? Content { get; set; }
    public Guid UserId { get; set; }

    public User? User { get; set; }
}

public class NotificationConfiguration : BaseEntityConfiguration<Notification>
{
    public override void Configure(EntityTypeBuilder<Notification> builder)
    {
        base.Configure(builder);
        
        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}