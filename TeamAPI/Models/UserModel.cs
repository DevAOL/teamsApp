namespace TeamAPI.Models
{
    public class UserModel
    {
        public long id { get; set; }
        public string? fullName { get; set; }
        public string? name { get; set; }
        public string? license { get; set; }
        public string? email { get; set; }
        public string? mobile { get; set; }
        public int average { get; set; }
        public string defaultTeams { get; set; } = string.Empty;

    }
}
