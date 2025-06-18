using System.Text.Json.Serialization;

namespace HelpdeskSystem.Domain.Dtos.ChatBot.Api;

public sealed record ChatBotApiResponse
{
    [JsonPropertyName("content")]
    public required string Message { get; init; }
}