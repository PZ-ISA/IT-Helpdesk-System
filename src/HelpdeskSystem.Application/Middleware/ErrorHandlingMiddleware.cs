using HelpdeskSystem.Application.Common;
using HelpdeskSystem.Domain.Exceptions;
using Microsoft.AspNetCore.Http;

namespace HelpdeskSystem.Application.Middleware;

public class ErrorHandlingMiddleware : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next.Invoke(context);
        }
        catch (Exception exception)
        {
            var problemDetails = ToErrorProblemDetails(exception, context);
            context.Response.StatusCode = (int)problemDetails.Status!;
            
            await context.Response.WriteAsJsonAsync(problemDetails);
        }
    }

    private ErrorProblemDetails ToErrorProblemDetails(Exception exception, HttpContext context)
    {
        var status = exception switch
        {
            BadRequestException => StatusCodes.Status400BadRequest,
            NotFoundException => StatusCodes.Status404NotFound,
            ForbidException => StatusCodes.Status403Forbidden,
            UnauthorizedException => StatusCodes.Status401Unauthorized,
            _ => StatusCodes.Status500InternalServerError
        };
        
        var problemDetails = new ErrorProblemDetails
        {
            Status = status,
            Title = "An error occurred",
            Type = exception.GetType().Name,
            Detail = exception.Message,
            Instance = context.Request.Path,
        };
        
        return problemDetails;
    }
}