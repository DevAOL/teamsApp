using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TeamModel.Migrations
{
    /// <inheritdoc />
    public partial class AddNumberOfPlayers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(name: "numberOfPlayers", table: "Events", type: "integer", nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn("numberOfPlayers", "Events");
        }
    }
}
