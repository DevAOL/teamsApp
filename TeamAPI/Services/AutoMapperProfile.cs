using AutoMapper;
using TeamAPI.Models;
using TeamModel.Entities;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<Event, EventModel>();
        CreateMap<User, UserModel>();
        CreateMap<Player, PlayerModel>();
        CreateMap<TeamLineUp, TeamLineUpModel>();
    }
}