using FluentValidation;
using HelpdeskSystem.Application.Common;
using HelpdeskSystem.Domain.Dtos.Accounts;

namespace HelpdeskSystem.Application.Validators.Accounts;

public class RegisterDtoValidator : AbstractValidator<RegisterDto>
{
    public RegisterDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(25)
            .WithMessage("Name field is required with max length of 25 characters");
        
        RuleFor(x => x.Surname)
            .NotEmpty()
            .MaximumLength(25)
            .WithMessage("Surname field is required with max length of 25 characters");

        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .WithMessage("Email field is required and must be type of email address")
            .NotEqual("chat@bot.com")
            .WithMessage("Email address is already in use");

        RuleFor(x => x.ConfirmPassword)
            .NotEmpty()
            .Equal(x => x.Password)
            .WithMessage("Passwords do not match");

        RuleFor(x => x.Role)
            .Custom((role, context) =>
            {
                if (!Roles.RolesNames.Contains(role))
                {
                    context.AddFailure("Role", $"Role does not exist. Role must be in {string.Join(",", Roles.RolesNames)}");
                }
            })
            .When(x => x.Role is not null);
    }
}