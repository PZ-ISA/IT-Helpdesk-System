# IT Helpdesk System - Backend

## Technology stack
- C#
- .NET 9
- ASP.NET Minimal API
- Entity Framework Core
- Microsoft SQL Server

## Installation & Setup
**1. .NET SDK**
- Download and install .NET 9 SDK from [here](https://dotnet.microsoft.com/en-us/download/dotnet/9.0)
- Ensure you installed it by typing `dotnet --info` in terminal

**2. Configure Database**
- Ensure the MS Sql Server is installed and running
- Modify the connection string in `appsettings.json` in **HelpdeskSystem.API**

**3. JWT Secret**
- Generate JWT Secret and modify the filed in `appsettings.json` file

**4. Database**
- Now you have to apply migrations to database. Open terminal and past this command
```
ef database update --project HelpdeskSystem.Infrastructure/HelpdeskSystem.Infrastructure.csproj --startup-project HelpdeskSystem.API/HelpdeskSystem.API.csproj --context HelpdeskSystem.Infrastructure.Contexts.HelpdeskDbContext --configuration Debug <migration> --connection "<connection_string>"
```

**5. SendGrid**
- Add SendGrid Api Key in the `appsettings.json` file

**6. Run project**
- If you want to run project from terminal then run this command:
```
dotnet run --project HelpdeskSystem.API
```

## API Documentation

The API is documented using OpenAPI. Once the backend is running the browser should automatically launch the documentation. If not then visit:

for **HTTPS**
```
https://localhost:5001/swagger
```

for **HTTP**
```
https://localhost:500/swagger
```
