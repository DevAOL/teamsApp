using Microsoft.AspNetCore.Mvc;
using TeamModel;
using TeamModel.Entities;
using TeamAPI.Services;
using AutoMapper;

namespace TeamAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamController : Controller
    {
        private readonly ILogger<TeamController> _logger;
        private readonly IMapper _mapper;
        private readonly TeamDataContext _context;


        public TeamController(ILogger<TeamController> logger, IMapper mapper, TeamDataContext context)
        {
            _logger = logger;
            _mapper = mapper;
            _context = context;
        }

        [HttpGet("getTeam")]
        public IActionResult GetTeam(long id)
        {
            var team = TeamService.GetTeam(_context, id);
            return Ok(team);
        }

        [HttpGet]
        public IActionResult Get()
        {
            var teams = TeamService.GetMembers(_context);
            return Ok(teams);
        }

        [HttpPost("addPlayersToEvents")]
        public IActionResult AddPlayersToEvents()
        {
            TeamService.AddPlayersToEvents(_context, _mapper);
            return Ok();
        }

        [HttpPost]
        public IActionResult Post([FromBody] TeamLineUp data)
        {
            var team = TeamService.AddUser(_context, data);
            return Ok(team);
        }

        [HttpPut]
        public IActionResult Put([FromBody] TeamLineUp data)
        {
            var team = TeamService.UpdateUser(_context, _mapper, data);
            return Ok(team);
        }

        [HttpDelete]
        public IActionResult Delete(long id)
        {
            var team = TeamService.DeleteUser(_context, _mapper, id);
            return Ok(team);
        }

    }
}
