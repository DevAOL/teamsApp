using AutoMapper;
using TeamAPI.Models;
using TeamModel;
using TeamModel.Entities;

namespace TeamAPI.Services
{
    public class UserService
    {
        public static List<UserModel>? GetUsers(TeamDataContext context, IMapper mapper)
        {
            var users = context.Users.ToList().OrderBy(u => u.fullName);

            var list = new List<UserModel>();

            foreach (var user in users)
            {
                var model = mapper.Map<UserModel>(user);
                if (model != null)
                {
                    list.Add(model);
                }
            }

            if (list.Count <= 0)
                return null;

            return list;
        }

        public static List<UserModel>? AddUser(TeamDataContext context, IMapper mapper, User data)
        {
            var obj = context.Users.Where(u => u.fullName == data.fullName).FirstOrDefault();

            if (obj == null)
            {
                context.Users.Add(data);
                context.SaveChanges();
            }
            return GetUsers(context, mapper);
        }

        public static List<UserModel>? UpdateUser(TeamDataContext context, IMapper mapper, User data)
        {
            User? user = context.Users?.FirstOrDefault(a => a.id == data.id);

            if (user != null)
            {
                user.fullName = data.fullName;
                user.name = data.name;
                user.license = data.license;
                user.mobile = data.mobile;
                user.email = data.email;
                user.average = data.average;

                context.SaveChanges();
            }

            return GetUsers(context, mapper);
        }

        public static void DeleteUser(TeamDataContext context, long id)
        {
            User? user = context.Users?.FirstOrDefault(a => a.id == id);

            if (user != null)
            {
                context.Remove(user);
                context.SaveChanges();
            }
        }

    }
}
