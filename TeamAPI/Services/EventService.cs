using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TeamAPI.Models;
using TeamModel;
using TeamModel.Entities;

namespace TeamAPI.Services
{
    public class EventService
    {

        public static List<EventModel>? GetEvents(TeamDataContext context, IMapper mapper, bool allEvents)
        {
            var events = context.Events.ToList().OrderBy(a => a.teamTypeId).OrderBy(a => a.date);

            if (events == null) 
                return null;

            if (!allEvents)
                events = events.Where(e => e.date >= DateTime.Now).ToList().OrderBy(a => a.teamTypeId).OrderBy(a => a.date);

            var list = new List<EventModel>();

            foreach (var item in events)
            {
                var model = mapper.Map<EventModel>(item);
                if (model != null)
                {
                    model.teamName = Helper.GetTeamName(item.teamTypeId);
                    model.weekDay = Helper.GetWeekDay(item.date.Value.DayOfWeek);
                    list.Add(model);
                }
            }

            if (list.Count <= 0)
                return null;

            return list;
        }

        public static EventModel? AddEvent(TeamDataContext context, IMapper mapper, Event data)
        {
            if (data == null)
                return new EventModel();

            var obj = context.Events.Where(e => e.teamTypeId == data.teamTypeId && e.date == data.date).FirstOrDefault();

            data.time = data != null ? data.time?.Replace('.', ':') : "";

            if (obj == null)
            {
                data.time = data != null ? data.time?.Replace('-', ':') : "";
                if (data != null)
                {
                    context.Events.Add(data);
                    context.SaveChanges();
                }
            }

            var model = mapper.Map<EventModel>(data);
            model.teamName = Helper.GetTeamName(data.teamTypeId);

            return model;

        }

        public static void UpdateEvent(TeamDataContext context, Event data)
        {
            Event? item = context.Events?.FirstOrDefault(a => a.id == data.id);

            if (item != null)
            {
                item.teamTypeId = data.teamTypeId;
                item.matchNumber = data.matchNumber;
                item.round = data.round;
                item.date = data.date;
                item.time = data.time;
                item.place = data.place;
                item.opponents = data.opponents;
                item.status = data.status;

                context.SaveChanges();
            }
        }

        public static void UpdateEventStatus(TeamDataContext context, IMapper mapper, Event data)
        {
            Event? item = context.Events?.FirstOrDefault(a => a.id == data.id);

            var teams = context.Teams.ToList();

            if (item != null)
            {
                item.status = data.status;
                item.numberOfPlayers = teams.Where(t => t.eventId == data.id).ToList().Count;
                context.SaveChanges();
            }
        }

        public static void DeleteEvent(TeamDataContext context, long id)
        {
            Event? item = context.Events?.FirstOrDefault(a => a.id == id);

            if (item != null)
            {
                context.Remove(item);
                context.SaveChanges();
            }
        }

    }
}
