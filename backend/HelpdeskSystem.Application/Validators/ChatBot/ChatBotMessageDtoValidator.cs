using FluentValidation;
using HelpdeskSystem.Domain.Dtos.ChatBot;

namespace HelpdeskSystem.Application.Validators.ChatBot;

public class ChatBotMessageDtoValidator : AbstractValidator<ChatBotMessageDto>
{
    public ChatBotMessageDtoValidator()
    {
        RuleFor(x => x.Message)
            .MaximumLength(250)
            .NotEmpty();

        RuleFor(x => x.Date)
            .NotEmpty();
    }
} 