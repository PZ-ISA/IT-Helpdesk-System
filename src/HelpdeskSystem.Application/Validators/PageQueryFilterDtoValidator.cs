using FluentValidation;
using HelpdeskSystem.Domain.Common;

namespace HelpdeskSystem.Application.Validators;

public class PageQueryFilterDtoValidator : AbstractValidator<PageQueryFilterDto>
{
    private readonly int[] _allowedPageSizes = [10, 25, 50, 100];

    public PageQueryFilterDtoValidator()
    {
        RuleFor(x => x.PageNumber).GreaterThanOrEqualTo(1);

        RuleFor(x => x.PageSize)
            .Custom((value, context) =>
            {
                if (!_allowedPageSizes.Contains(value))
                {
                    context.AddFailure($"Page Size is invalid. Page size must be in {string.Join(",", _allowedPageSizes)}");
                }
            });
    }
}