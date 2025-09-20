namespace TeamAPI.Models
{
    public class EventModel
    {
        public long id { get; set; }
        public int teamTypeId { get; set; }
        public string teamName { get; set; } = string.Empty;
        public string matchNumber { get; set; } = string.Empty;
        public int round { get; set; }
        public DateTime date { get; set; }
        public string time { get; set; } = string.Empty;
        public string weekDay { get; set; } = string.Empty;
        public string place { get; set; } = string.Empty;
        public string opponents { get; set; } = string.Empty;
        public int numberOfPlayers { get; set; }
        public string status { get; set; } = string.Empty;

    }
}
