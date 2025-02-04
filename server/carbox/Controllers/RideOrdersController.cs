using Microsoft.AspNetCore.Mvc;
using carbox.Models;
using carbox.Repositories;
using carbox.Services;
using System;
using System.Threading.Tasks;

namespace carbox.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RideOrdersController : ControllerBase
    {
        private readonly RideService _rideService;

        public RideOrdersController(RideService rideService)
        {
            _rideService = rideService;
        }

        // Creates a new ride order
        [HttpPost]
        public async Task<IActionResult> CreateRideOrder([FromBody] RideOrderRequest rideOrderRequest)
        {
            if (rideOrderRequest == null || !ModelState.IsValid)
            {
                return BadRequest("Invalid ride order request.");
            }

            var rideOrder = new RideOrder
            {
                UserId = rideOrderRequest.UserId,
                Origin = rideOrderRequest.Origin,
                Destination = rideOrderRequest.Destination,
                RideTime = rideOrderRequest.RideTime,
                CreatedAt = DateTime.UtcNow
            };

            var createdRide = await _rideService.CreateRideOrderAsync(rideOrder);

            return Ok(new { Message = "Ride order created successfully" });
        }

        // Assigns a car to a ride order
        [HttpPost("{rideOrderId}/assign")]
        public async Task<IActionResult> AssignCar(string rideOrderId)
        {
            try
            {
                var ride = await _rideService.AssignCarToRide(rideOrderId);
                return Ok(ride);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        // DTO for incoming ride order request
        public class RideOrderRequest
        {
            public string UserId { get; set; }
            public string Origin { get; set; }
            public string Destination { get; set; }
            public DateTime RideTime { get; set; }
        }
    }
}



//using carbox.Date;
//using Microsoft.AspNetCore.Mvc;
//using MongoDB.Bson;
//using MongoDB.Driver;
//using carbox.Models;

//namespace carbox.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class RideOrdersController : ControllerBase
//    {
//        private readonly IMongoCollection<RideOrder> _rideOrdersCollection;

//        public RideOrdersController(MongoDBService mongoDBService)
//        {
//            // MongoDB connection setup
//            _rideOrdersCollection = mongoDBService.Database?.GetCollection<RideOrder>("Orders");
//        }

//        [HttpPost]
//        public IActionResult CreateRideOrder([FromBody] RideOrderRequest rideOrderRequest)
//        {
//            if (rideOrderRequest == null || !ModelState.IsValid)
//            {
//                return BadRequest("Invalid ride order request.");
//            }

//            var rideOrder = new RideOrder
//            {
//                UserId = rideOrderRequest.UserId,
//                Origin = rideOrderRequest.Origin,
//                Destination = rideOrderRequest.Destination,
//                RideTime = rideOrderRequest.RideTime,
//                CreatedAt = DateTime.UtcNow
//            };

//            _rideOrdersCollection.InsertOne(rideOrder);

//            return Ok(new { Message = "Ride order created successfully", RideOrderId = rideOrder.UserId });
//        }
//    }

//    // DTO for incoming ride order request
//    public class RideOrderRequest
//    {
//        public string UserId { get; set; }
//        public string Origin { get; set; }
//        public string Destination { get; set; }
//        public DateTime RideTime { get; set; }
//    }
//}
