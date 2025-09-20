using Microsoft.OpenApi.Extensions;

namespace TeamAPI.Services
{
    public class Helper
    {
        public static string GetWeekDay(DayOfWeek value)
        {
            switch (value)
            {
                case DayOfWeek.Monday:
                    return Models.WeekDay.monday.GetDisplayName();
                case DayOfWeek.Tuesday:
                    return Models.WeekDay.tuesday.GetDisplayName();
                case DayOfWeek.Wednesday:
                    return Models.WeekDay.wednesday.GetDisplayName();
                case DayOfWeek.Thursday:
                    return Models.WeekDay.thursday.GetDisplayName();
                case DayOfWeek.Friday:
                    return Models.WeekDay.friday.GetDisplayName();
                case DayOfWeek.Saturday:
                    return Models.WeekDay.saturday.GetDisplayName();
                case DayOfWeek.Sunday:
                    return Models.WeekDay.sunday.GetDisplayName();
                default:
                    return "";
            }
        }

        public static string GetTeamName(int value)
        {
            switch (value)
            {
                case 1:
                    return Models.TeamType.liga.GetDisplayName();
                case 2:
                    return Models.TeamType.division.GetDisplayName();
                case 3:
                    return Models.TeamType.row.GetDisplayName();
                case 4:
                    return Models.TeamType.free.GetDisplayName();
                default:
                    return "";
            }
        }

        public static int GetTeamMaxMembers(int value)
        {
            switch (value)
            {
                case 1:
                    return 7;
                case 2:
                    return 7;
                case 3:
                    return 4;
                case 4:
                    return 5;
                default:
                    return 0;
            }
        }

        
    }
}
