using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TeamModel;
using TeamModel.Entities;
using TeamAPI.Services;

namespace TeamAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlayersController : Controller
    {
        private readonly ILogger<PlayersController> _logger;
        private readonly IMapper _mapper;
        private readonly TeamDataContext _context;


        public PlayersController(ILogger<PlayersController> logger, AutoMapper.IMapper mapper, TeamDataContext context)
        {
            _logger = logger;
            _mapper = mapper;
            _context = context;
        }

        [HttpGet]
        public IActionResult Get(long id)
        {
            var players = PlayerService.GetPlayers(_context, _mapper, id);
            return Ok(players);
        }

        [HttpGet("events")]
        public IActionResult GetEvents(long id)
        {
            var events = PlayerService.GetEvents(_context, id);
            return Ok(events);
        }

        [HttpPost("addEvents")]
        public IActionResult AddEvents(long id)
        {
            PlayerService.AddEvents(_context);
            return Ok();
        }

        [HttpPut]
        public IActionResult Put([FromBody] Player data)
        {
            var player = PlayerService.UpdatePlayer(_context, _mapper, data);
            return Ok(player);
        }

    }
}
