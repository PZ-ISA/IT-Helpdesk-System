using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HelpdeskSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTicketEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_AspNetUsers_SupportUserId",
                table: "Tickets");

            migrationBuilder.RenameColumn(
                name: "SupportUserId",
                table: "Tickets",
                newName: "AdminUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Tickets_SupportUserId",
                table: "Tickets",
                newName: "IX_Tickets_AdminUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_AspNetUsers_AdminUserId",
                table: "Tickets",
                column: "AdminUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_AspNetUsers_AdminUserId",
                table: "Tickets");

            migrationBuilder.RenameColumn(
                name: "AdminUserId",
                table: "Tickets",
                newName: "SupportUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Tickets_AdminUserId",
                table: "Tickets",
                newName: "IX_Tickets_SupportUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_AspNetUsers_SupportUserId",
                table: "Tickets",
                column: "SupportUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
