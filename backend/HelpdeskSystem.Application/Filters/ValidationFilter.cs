using FluentValidation;
using HelpdeskSystem.Application.Common;
using Microsoft.AspNetCore.Http;

namespace HelpdeskSystem.Application.Filters;

public class ValidationFilter<T> : IEndpointFilter
{
    private readonly IValidator<T> _validator;

    public ValidationFilter(IValidator<T> validator)
    {
        _validator = validator;
    }
    
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var request = context.Arguments.OfType<T>().FirstOrDefault();
        if (request == null)
        {
            var problemDetails = new ErrorProblemDetails
            {
                Title = "Invalid request body",
                Status = StatusCodes.Status400BadRequest,
                Detail = "Request body could not be parsed or is missing.",
                Type = "ValidationError"
            };
            
            return Results.Problem(problemDetails);
        }
        
        var result = await _validator.ValidateAsync(request, context.HttpContext.RequestAborted);

        if (!result.IsValid)
        {
            var errors = result.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

            var problemDetails = new ErrorProblemDetails
            {
                Title = "Validation failed",
                Status = StatusCodes.Status400BadRequest,
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                Instance = context.HttpContext.Request.Path,
                Detail = "One or more validation errors occurred.",
                Errors = errors,
            };
            
            return Results.Problem(problemDetails);
        }
        
        return await next(context);
    }
}