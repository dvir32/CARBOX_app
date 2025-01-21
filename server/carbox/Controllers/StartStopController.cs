using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using carbox.Date;


using MongoDB.Driver;
using Microsoft.Extensions.Primitives;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace carbox.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class StartStopController : ControllerBase
    {
        //Car car1 = new Car(1, "stop");
        private readonly IMongoCollection<Car> cars;

        public StartStopController(MongoDBService mongoDBService)
        {
            cars = mongoDBService.Database?.GetCollection<Car>("carboxCollection");
        }



        // GET: api/StartStop
        [HttpGet]
        public IActionResult Get()
        {
            var car_list = cars.Find(car => true).ToList();
            return Ok(car_list);
        }

        // POST: api/StartStop
        [HttpPost]
        public IActionResult UpdateCarStatus([FromBody] StatusRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.status))
            {
                return BadRequest("Invalid status request.");
            }

            var car = cars.Find(car => true).FirstOrDefault();
            if (car == null)
            {
                return NotFound("No cars available to update.");
            }

            car.Status = request.status;
            cars.ReplaceOne(c => c.CarId == car.CarId, car);

            return Ok(new { message = $"Status updated to: {car.Status}", car });
        }
    }

    public class StatusRequest
    {
        public string status { get; set; }
    }


    //    [HttpGet]
    //    public async Task<IEnumerable<Car>> Get()
    //    {
    //        return await cars.Find(FilterDefinition<Car>.Empty).ToListAsync();
    //    }

    //    [HttpPost]
    //    public async Task<ActionResult> Post(string status)
    //    {
    //        // Find the first record in the collection
    //        var car = await cars.Find(_ => true).FirstOrDefaultAsync();
    //        if (car == null)
    //        {
    //            return NotFound(); // Return 404 if no records are found
    //        }

    //        // Create a filter to find the specific document by ID
    //        var filter = Builders<Car>.Filter.Eq(x => x.CarId, car.CarId);

    //        // Define the update operation to set the status
    //        var update = Builders<Car>.Update.Set(x => x.Status, status);

    //        // Perform the update
    //        var result = await cars.UpdateOneAsync(filter, update);

    //        // Check if the update was successful
    //        if (result.ModifiedCount == 0)
    //        {
    //            return BadRequest("Failed to update the status."); // Return an error if no records were updated
    //        }

    //        return Ok("Status updated successfully."); // Return success response
    //    }

    //}


    public class Car
    {
        public int CarId { get; set; }

        [BsonId]
        public ObjectId Id { get; set; }

        public string Status { get; set; }

        public Car(int CarId, string status)
        {
            CarId = CarId;
            Status = status;
        }
    }
};



