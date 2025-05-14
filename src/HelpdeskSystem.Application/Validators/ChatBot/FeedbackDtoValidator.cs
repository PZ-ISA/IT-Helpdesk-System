using FluentValidation;
using HelpdeskSystem.Domain.Dtos.ChatBot;

namespace HelpdeskSystem.Application.Validators.ChatBot;

public class FeedbackDtoValidator : AbstractValidator<FeedbackDto>
{
    public FeedbackDtoValidator()
    {
        RuleFor(x => x.Feedback)
            .IsInEnum()
            .NotEmpty();

    }
}