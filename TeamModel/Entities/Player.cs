namespace TeamModel.Entities
{
	public class Player
	{
		public long id { get; set; }
        public long eventId { get; set; }
        public long userId { get; set; }
        public bool isAvailable { get; set; }

    }
}
