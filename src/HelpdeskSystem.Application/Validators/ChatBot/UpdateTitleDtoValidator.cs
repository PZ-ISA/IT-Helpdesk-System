using FluentValidation;
using HelpdeskSystem.Domain.Dtos.ChatBot;

namespace HelpdeskSystem.Application.Validators.ChatBot;

public class UpdateTitleDtoValidator : AbstractValidator<UpdateTitleDto>
{
    public UpdateTitleDtoValidator()
    {
        RuleFor(x => x.Title)
            .MaximumLength(20)
            .NotEmpty();
    }
}