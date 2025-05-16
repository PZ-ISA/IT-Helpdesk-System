using HelpdeskSystem.Domain.Common;
using HelpdeskSystem.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HelpdeskSystem.Domain.Entities;

public sealed record Ticket : BaseEntity
{
    public required string Title { get; set; }
    public required string Description { get; set; }
    public TicketStatus Status { get; set; }
    public Guid EmployeeUserId { get; set; }
    public Guid? AdminUserId { get; set; }

    public User? EmployeeUser { get; set; }
    public User? AdminUser { get; set; }
    public ICollection<TicketMessage>? TicketMessages { get; set; }
}

public class TicketConfiguration : BaseEntityConfiguration<Ticket>
{
    public override void Configure(EntityTypeBuilder<Ticket> builder)
    {
        base.Configure(builder);

        builder.HasOne(x => x.EmployeeUser)
            .WithMany()
            .HasForeignKey(x => x.EmployeeUserId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne(x => x.AdminUser)
            .WithMany()
            .HasForeignKey(x => x.AdminUserId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasMany(x => x.TicketMessages)
            .WithOne(tm => tm.Ticket)
            .HasForeignKey(tm => tm.TicketId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}