using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HelpdeskSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedChatBotModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Content",
                table: "TicketMessages",
                newName: "Message");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "ChatBotMessages",
                newName: "Message");

            migrationBuilder.AlterColumn<int>(
                name: "Feedback",
                table: "ChatBotSessions",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "ChatBotSessions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Title",
                table: "ChatBotSessions");

            migrationBuilder.RenameColumn(
                name: "Message",
                table: "TicketMessages",
                newName: "Content");

            migrationBuilder.RenameColumn(
                name: "Message",
                table: "ChatBotMessages",
                newName: "Content");

            migrationBuilder.AlterColumn<int>(
                name: "Feedback",
                table: "ChatBotSessions",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
