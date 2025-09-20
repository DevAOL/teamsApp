using AutoMapper;
using TeamAPI.Models;
using TeamModel;
using TeamModel.Entities;

namespace TeamAPI.Services
{
    public class PlayerService
    {
        // Fetch data to team line up
        public static List<TeamLineUpModel>? GetPlayers(TeamDataContext context, IMapper mapper, long id)
        {
            var users = context.Users.ToList();
            var players = context.Players.ToList();
            var teams = context.Teams.ToList();

            var items = (from u in users
                         join p in players on u.id equals p.userId
                         where p.eventId == id && p.isAvailable
                         orderby u.average descending, u.name
                         select new TeamLineUpModel
                         {
                             id = p.id,
                             eventId = p.eventId,
                             userId = u.id,
                             userName = u.name ?? "",
                             email = u.email ?? ""
                         }).ToList();
            
            var list = new List<TeamLineUpModel>();

            foreach (var item in items)
            {
                // The user is selected
                var obj = context.Teams.Where(t => t.eventId == item.eventId && t.userId == item.userId).FirstOrDefault();
                // Check user is not selected for another event in the same round or date
                if (obj == null)
                {
                    if (!CheckPlayers(context, item.eventId, item.userId))
                        list.Add(item);
                }
            }

            if (list.Count <= 0)
                return null;
            return list;
        }

        private static bool CheckPlayers(TeamDataContext context, long id, long userId)
        {
            var item = context.Events?.FirstOrDefault(i => i.id == id);

            if (item == null) 
                return false;

            var events = context.Events?.Where(e => e.round == item.round && e.date == item.date).ToList();

            if (events?.Count <= 0)
                return false;

            foreach (var e in events)
            {
                // Check if the user is selected
                return context.Teams.Where(t => t.eventId == e.id && t.userId == userId).FirstOrDefault() != null;
            }
            
            return false;
        }

        // Fetch data to edit user
        public static List<PlayerModel>? GetEvents(TeamDataContext context, long id)
        {
            var players = context.Players.ToList();
            var events = context.Events.ToList().OrderBy(p => p.date); 

            var items = (from p in players
                           join e in events on p.eventId equals e.id
                           where p.userId == id
                           orderby e.date
                           select new PlayerModel {
                               id = p.id,
                               eventId = e.id,
                               userId = id,
                               teamTypeId = e.teamTypeId,
                               round = e.round,
                               date = e.date ?? DateTime.MinValue,
                               time = e.time ?? "",
                               place = e.place ?? "",
                               isAvailable = p.isAvailable,
                           }).ToList();

            if (items == null)
                return null;

            var list = new List<PlayerModel>();

            foreach (var item in items)
            {
                list.Add(item);
            }

            if (list.Count <= 0)
                return null;
            
            return list;
        }

        // Add default events for the users
        public static void AddEvents(TeamDataContext context)
        {
            var users = context.Users.ToList();
            var events = context.Events.Where(e => e.date > System.DateTime.Now).ToList().OrderBy(e => e.teamTypeId);

            if (users == null || events == null)
                return;

            foreach (var user in users)
            {
                if (user.id == 8)
                {
                    string[]? teamTypeIds = user?.defaultTeams?.Split(';');

                    if (teamTypeIds == null)
                        break;

                    foreach (var teamTypeId in teamTypeIds)
                    {
                        foreach (var item in events)
                        {
                            if (teamTypeId == item.teamTypeId.ToString() && teamTypeId == "3")
                            {
                                var obj = context.Players.Where(p => p.eventId == item.id && p.userId == user.id).FirstOrDefault();

                                if (obj == null)
                                {
                                    Player player = new Player
                                    {
                                        eventId = item.id,
                                        userId = user?.id > 0 ? user.id : 0,
                                        isAvailable = user.defaultTeams.Contains(item.teamTypeId.ToString()),
                                    };

                                    context.Players.Add(player);
                                    context.SaveChanges();
                                }
                            }
                        }
                    }
                }
            }
        }

        // Update user is available or not to an event
        public static PlayerModel UpdatePlayer(TeamDataContext context, IMapper mapper, Player data)
        {
            Player? player = context.Players?.FirstOrDefault(p => p.id == data.id);

            if (player == null)
                return new PlayerModel();

            player.isAvailable = !player.isAvailable;
            context.SaveChanges();

            var model = mapper.Map<PlayerModel>(player);
            var user = context.Users.FirstOrDefault(u => u.id == data.userId);
            model.userName = user?.name ?? "";

            return model;
        }

    }
}
