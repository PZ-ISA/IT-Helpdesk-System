using FluentValidation;
using HelpdeskSystem.Domain.Dtos.Users;

namespace HelpdeskSystem.Application.Validators.User;

public class UpdateUserDtoValidator : AbstractValidator<UpdateUserDto>
{
    public UpdateUserDtoValidator()
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
    }
}