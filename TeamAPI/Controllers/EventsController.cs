using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TeamAPI.Services;
using TeamModel;
using TeamModel.Entities;

namespace TeamAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : Controller
    {
        private readonly ILogger<EventsController> _logger;
        private readonly IMapper _mapper;
        private readonly TeamDataContext _context;

        public EventsController(ILogger<EventsController> logger, AutoMapper.IMapper mapper, TeamDataContext context)
        {
            _logger = logger;
            _mapper = mapper;
            _context = context;
        }

        [HttpGet]
        public IActionResult Get(bool allEvents)
        {
            var events = EventService.GetEvents(_context, _mapper, allEvents);
            return Ok(events);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Event data)
        {
            var item = EventService.AddEvent(_context, _mapper, data);
            return Ok(item);
        }

        [HttpPut]
        public IActionResult Put([FromBody] Event data)
        {
            EventService.UpdateEvent(_context, data);
            return Ok();
        }

        [HttpPut("updateStatus")]
        public IActionResult UpdateStatus([FromBody] Event data)
        {
            EventService.UpdateEventStatus(_context, _mapper, data);
            return Ok();
        }

        [HttpDelete]
        public IActionResult Delete(long id)
        {
            EventService.DeleteEvent(_context, id);
            return Ok();
        }

    }
}
