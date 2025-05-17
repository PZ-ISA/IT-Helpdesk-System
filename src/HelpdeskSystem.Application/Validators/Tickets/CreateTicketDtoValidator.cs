using FluentValidation;
using HelpdeskSystem.Domain.Dtos.Tickets;

namespace HelpdeskSystem.Application.Validators.Tickets;

public class CreateTicketDtoValidator : AbstractValidator<CreateTicketDto>
{
    public CreateTicketDtoValidator()
    {
        RuleFor(x => x.Title)
            .MaximumLength(50)
            .NotEmpty();
        
        RuleFor(x => x.Description)
            .MaximumLength(500)
            .NotEmpty();
    }
}