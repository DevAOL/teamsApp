using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TeamModel;
using TeamModel.Entities;
using TeamAPI.Services;

namespace TeamAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : Controller
    {
        private readonly ILogger<UsersController> _logger;
        private readonly IMapper _mapper;
        private readonly TeamDataContext _context;


        public UsersController(ILogger<UsersController> logger, AutoMapper.IMapper mapper, TeamDataContext context)
        {
            _logger = logger;
            _mapper = mapper;
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var users = UserService.GetUsers(_context, _mapper);
            return Ok(users);
        }

        [HttpPost]
        public IActionResult Post([FromBody] User data)
        {
            var user = UserService.AddUser(_context, _mapper, data);
            return Ok(user);
        }

        [HttpPut]
        public IActionResult Put([FromBody] User data)
        {
            var users = UserService.UpdateUser(_context, _mapper, data);
            return Ok(users);
        }

        [HttpDelete]
        public IActionResult Delete(long id)
        {
            UserService.DeleteUser(_context, id);
            return Ok();
        }
    }
}
