namespace TeamAPI.Models
{
    public class TeamLineUpModel
    {
        public long id { get; set; }
        public long eventId { get; set; }
        public long userId { get; set; }
        public string userName { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
    }
}
