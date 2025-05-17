using HelpdeskSystem.Domain.Dtos.ExportData;

namespace HelpdeskSystem.Domain.Interfaces;

public interface IDataExportService
{
    public Task<ICollection<ExportTicketDto>> ExportTicketsDataAsync(CancellationToken ct);
    public Task<ICollection<ExportChatDto>> ExportChatDataAsync(CancellationToken ct);
}