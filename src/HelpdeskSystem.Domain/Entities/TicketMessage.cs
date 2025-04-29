using HelpdeskSystem.Domain.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HelpdeskSystem.Domain.Entities;

public sealed record TicketMessage : BaseEntity
{
    public required string Content { get; set; }
    public Guid TicketId { get; set; }
    public Guid UserId { get; set; }

    public Ticket? Ticket { get; set; }
    public User? User { get; set; }
}

public class TicketMessageConfiguration : BaseEntityConfiguration<TicketMessage>
{
    public override void Configure(EntityTypeBuilder<TicketMessage> builder)
    {
        base.Configure(builder);
        
        builder.HasOne(x => x.Ticket)
            .WithMany(t => t.TicketMessages)
            .HasForeignKey(x => x.TicketId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}