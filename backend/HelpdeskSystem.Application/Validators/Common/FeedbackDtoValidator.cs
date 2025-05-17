using FluentValidation;
using HelpdeskSystem.Domain.Dtos.Common;

namespace HelpdeskSystem.Application.Validators.Common;

public class FeedbackDtoValidator : AbstractValidator<FeedbackDto>
{
    public FeedbackDtoValidator()
    {
        RuleFor(x => x.Feedback)
            .IsInEnum()
            .NotEmpty();

    }
}