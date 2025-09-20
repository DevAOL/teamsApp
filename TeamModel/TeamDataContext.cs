using TeamModel.Entities;
using Microsoft.EntityFrameworkCore;


namespace TeamModel
{
    public class TeamDataContext : DbContext
    {

        public TeamDataContext() { }

        public TeamDataContext(DbContextOptions<TeamDataContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }

        #region Entities
        public DbSet<Event> Events { get; set; } = null!;

        public DbSet<User> Users { get; set; } = null!;
        
        public DbSet<Player> Players { get; set; } = null!;

        public DbSet<TeamLineUp> Teams { get; set; } = null!;

        public DbSet<TeamType> TeamTypes { get; set; } = null!;

        #endregion

    }
}