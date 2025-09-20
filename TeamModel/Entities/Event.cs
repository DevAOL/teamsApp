namespace TeamModel.Entities
{
	public class Event
	{
		public long id { get; set; }
        public int teamTypeId { get; set; }
        public string? matchNumber { get; set; }
        public int round { get; set; }
        public DateTime? date { get; set; }
		public string? time { get; set; }
		public string? place { get; set; }
		public string? opponents { get; set; }
		public int? numberOfPlayers { get; set; }
        public string? status { get; set; }

    }
}
