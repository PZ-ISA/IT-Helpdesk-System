using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HelpdeskSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEmailLogEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EmailLogs_AspNetUsers_UserId",
                table: "EmailLogs");

            migrationBuilder.DropIndex(
                name: "IX_EmailLogs_UserId",
                table: "EmailLogs");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "EmailLogs");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "EmailLogs",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_EmailLogs_UserId",
                table: "EmailLogs",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_EmailLogs_AspNetUsers_UserId",
                table: "EmailLogs",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
