namespace TeamModel.Entities
{
	public class PlayerModel
	{
		public long id { get; set; }
        public long eventId { get; set; }
        public int teamTypeId { get; set; }
        public int round { get; set; }
        public DateTime? date { get; set; }
        public string time { get; set; } = string.Empty;
        public string place { get; set; } = string.Empty;
        public long userId { get; set; }
        public string userName { get; set; } = string.Empty;
        public bool isAvailable { get; set; }

    }
}
