using AutoMapper;
using TeamAPI.Models;
using TeamModel;
using TeamModel.Entities;

namespace TeamAPI.Services
{
    public class TeamService
    {
        public static List<TeamLineUpModel>? GetTeam(TeamDataContext context, long eventId)
        {
            if (eventId < 0)
                return null;

            var users = context.Users.ToList();
            var teams = context.Teams.ToList();

            var items = (from u in users
                         join t in teams on u.id equals t.userId
                         where t.eventId == eventId
                         orderby u.name
                         select new TeamLineUpModel
                         {
                             id = t.id,
                             eventId = t.eventId,
                             userId = u.id,
                             userName = u.name ?? "",
                             email = u.email ?? ""
                         }).ToList();

            var list = new List<TeamLineUpModel>();

            foreach (var item in items)
            {
                list.Add(item);
            }

            if (list.Count <= 0)
                return null;

            return list;
        }

        public static List<TeamLineUpModel>? GetMembers(TeamDataContext context)
        {
            var users = context.Users.ToList();
            var teams = context.Teams.ToList();
            var events = context.Events.ToList();

            var items = (from u in users
                         join t in teams on u.id equals t.userId
                         join e in events on t.eventId equals e.id
                         where e.status != "Sent"
                         orderby u.name
                         select new TeamLineUpModel
                         {
                             id = t.id,
                             eventId = t.eventId,
                             userId = u.id,
                             userName = u.name ?? "",
                             email = u.email ?? ""
                         }).ToList();

            var list = new List<TeamLineUpModel>();

            foreach (var item in items)
            {
                list.Add(item);
            }

            if (list.Count <= 0)
                return null;

            return list;
        }

        public static void AddPlayersToEvents(TeamDataContext context, IMapper mapper)
        {
            var events = context.Events.ToList().OrderBy(a => a.teamTypeId).OrderBy(a => a.date);

            if (events == null)
                return;

            foreach (var item in events)
            {
                var maxMembers = Helper.GetTeamMaxMembers(item.teamTypeId);
                
                var players = PlayerService.GetPlayers(context, mapper, item.id);
                if (players == null)
                    break;

                var i = 0;

                foreach (var player in players)
                {
                    var teamLineUp = new TeamLineUp { eventId = item.id, userId = player.userId};
                    context.Teams.Add(teamLineUp);
                    context.SaveChanges();

                    i++;
                    if (i > maxMembers)
                        break;
                }
            }
        }

        public static List<TeamLineUpModel>? AddUser(TeamDataContext context, TeamLineUp data)
        {
            context.Teams.Add(data);
            context.SaveChanges();

            return GetTeam(context, data.eventId); 
        }

        public static TeamLineUpModel UpdateUser(TeamDataContext context, IMapper mapper, TeamLineUp data)
        {
            TeamLineUp? team = context.Teams?.FirstOrDefault(a => a.id == data.id);

            if (team == null)
                return new TeamLineUpModel();

            team.eventId = data.eventId;
            team.userId = data.userId;

            context.SaveChanges();

            var model = mapper.Map<TeamLineUpModel>(data);
            var user = context.Users.FirstOrDefault(u => u.id == data.userId);
            model.userName = user?.name != null ? user.name : "";

            return model;
        }

        public static List<TeamLineUpModel>? DeleteUser(TeamDataContext context, IMapper mapper, long id)
        {
            TeamLineUp? user = context.Teams?.FirstOrDefault(a => a.id == id);

            long eventId = 0;

            if (user != null)
            {
                eventId = user.eventId;
                context.Remove(user);
                context.SaveChanges();
            }

            return GetTeam(context, eventId);

        }
    }
}
