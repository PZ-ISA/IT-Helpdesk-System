using HelpdeskSystem.Application.Filters;

namespace HelpdeskSystem.API.Extensions;

public static class ValidationExtensions
{
    public static RouteHandlerBuilder WithRequestValidation<T>(this RouteHandlerBuilder builder)
    {
        return builder.AddEndpointFilter<ValidationFilter<T>>()
            .ProducesValidationProblem();
    }
}