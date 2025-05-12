using Microsoft.AspNetCore.Mvc;

namespace HelpdeskSystem.Application.Common;

public class ErrorProblemDetails : ProblemDetails
{
    public IDictionary<string, string[]>? Errors { get; set; }
}