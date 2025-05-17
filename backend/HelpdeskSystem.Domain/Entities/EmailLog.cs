using HelpdeskSystem.Domain.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HelpdeskSystem.Domain.Entities;

public sealed record EmailLog : BaseEntity
{
    public required string Title { get; set; }
    public required string Content { get; set; }
    public required string Email { get; set; }
    public bool IsSuccess { get; set; }
    public Guid UserId { get; set; }

    public User? User { get; set; }
}

public class EmailLogConfiguration : BaseEntityConfiguration<EmailLog>
{
    public override void Configure(EntityTypeBuilder<EmailLog> builder)
    {
        base.Configure(builder);
        
        builder.HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}