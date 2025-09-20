using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TeamModel.Migrations
{
    /// <inheritdoc />
    public partial class AddTeamTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData("TeamTypes", "name", "Liga Damer");
            migrationBuilder.InsertData("TeamTypes", "name", "Øst 4-Damer");
            migrationBuilder.InsertData("TeamTypes", "name", "Øst Række Damer");
            migrationBuilder.InsertData("TeamTypes", "name", "Den fri");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData("TeamTypes", "name", "Liga Damer");
            migrationBuilder.DeleteData("TeamTypes", "name", "Øst 4-Damer");
            migrationBuilder.DeleteData("TeamTypes", "name", "Øst Række Damer");
            migrationBuilder.DeleteData("TeamTypes", "name", "Den fri");
        }
    }
}
