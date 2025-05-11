using FluentValidation;
using HelpdeskSystem.Application.Common;
using HelpdeskSystem.Domain.Dtos.Accounts;

namespace HelpdeskSystem.Application.Validators.Accounts;

public class RegisterDtoValidator : AbstractValidator<RegisterDto>
{
    public RegisterDtoValidator()
    {
        RuleFor(x => x.Name)
            .MaximumLength(25)
            .NotEmpty()
            .WithMessage("Name field is required with max length of 25 characters");
        
        RuleFor(x => x.Surname)
            .Length(25)
            .NotEmpty()
            .WithMessage("Surname field is required with max length of 25 characters");
        
        RuleFor(x => x.Email)
            .EmailAddress()
            .NotEmpty()
            .WithMessage("Email field is required and must be type of email address");

        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.Password)
            .NotEmpty()
            .WithMessage("Passwords do not match");

        RuleFor(x => x.Role)
            .Custom((role, context) =>
            {
                if (!Roles.RolesNames.Contains(role))
                {
                    context.AddFailure("Role", $"Role does not exist. Role must be in {string.Join(",", Roles.RolesNames)}");
                }
            });
    }
}