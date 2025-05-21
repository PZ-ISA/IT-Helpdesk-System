namespace HelpdeskSystem.Application.Services;

public class TemplateService
{
    private readonly string _templatePath;

    public TemplateService(string templateDirectory)
    {
        _templatePath = templateDirectory;
    }

    public string LoadTemplate(string templateName, Dictionary<string, string> variables)
    {
        var path = Path.Combine(_templatePath, $"{templateName}.html");

        if (!File.Exists(path))
            throw new FileNotFoundException($"Template '{templateName}' not found at path '{path}'.");

        var content = File.ReadAllText(path);

        foreach (var (key, value) in variables)
        {
            content = content.Replace($"{{{{{key}}}}}", value);
        }

        return content;
    }
}