using HelpdeskSystem.Application.Common;
using HelpdeskSystem.Domain.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;

namespace HelpdeskSystem.Application.Middleware;

public class CustomExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var status = exception switch
        {
            BadRequestException => StatusCodes.Status400BadRequest,
            NotFoundException => StatusCodes.Status404NotFound,
            ForbidException => StatusCodes.Status403Forbidden,
            _ => StatusCodes.Status500InternalServerError
        };
        httpContext.Response.StatusCode = status;

        var problemDetails = new ErrorProblemDetails
        {
            Status = status,
            Title = "An error occurred",
            Type = exception.GetType().Name,
            Detail = exception.Message,
            Instance = httpContext.Request.Path,
        };

        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true;
    }
}