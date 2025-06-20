namespace HelpdeskSystem.Domain.Dtos.Takeover;

public sealed record TakeoverDecisionDto
{
    public required bool Decision { get; set; }
}