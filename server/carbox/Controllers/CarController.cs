using Microsoft.AspNetCore.Mvc;
using carbox.Models;
using carbox.Repositories;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace carbox.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarController : ControllerBase
    {
        private readonly CarRepository _carRepository;

        // Constructor: Inject the repository
        public CarController(CarRepository carRepository)
        {
            _carRepository = carRepository;
        }

        // Add a new car
        [HttpPost("add")]
        public async Task<IActionResult> AddCar([FromBody] Car newCar)
        {
            if (newCar == null || string.IsNullOrEmpty(newCar.Id))
            {
                return BadRequest("Invalid car data.");
            }

            await _carRepository.AddCarAsync(newCar);
            return Ok(newCar);
        }

        // Get a specific car by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCarById(string id)
        {
            var car = await _carRepository.GetCarByIdAsync(id);
            if (car == null)
            {
                return NotFound("Car not found.");
            }
            return Ok(car);
        }

        // Get all available cars
        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableCars()
        {
            var availableCars = await _carRepository.GetAvailableCarsAsync();
            return Ok(availableCars);
        }

        // Update car details
        [HttpPut("update")]
        public async Task<IActionResult> UpdateCar([FromBody] Car updatedCar)
        {
            if (updatedCar == null || string.IsNullOrEmpty(updatedCar.Id))
            {
                return BadRequest("Invalid car data.");
            }

            await _carRepository.UpdateCarAsync(updatedCar);
            return Ok(new { message = "Car updated successfully", updatedCar });
        }


        //update סוללה
        // מקבלת ID של הרכב ואחוזי סוולה ןמעדכנת את ה DB.


        //update רשימת תחנות
        // מקבלת ID של הרכב ורשימת תחנות ומעדכנת את ה DB.

        //get מצב סוללה
        //משתמשת בפונקציה GetCarById(string id)

        //get רשימת תחנות
        //משתמשת בפונקציה GetCarById(string id)

    }
}




//using Microsoft.AspNetCore.Mvc;
//using carbox.Models;
//using MongoDB.Driver;
//using carbox.Date;

//namespace carbox.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class CarController : ControllerBase
//    {
//        private readonly IMongoCollection<Car> _carCollection;

//        public CarController(MongoDBService mongoDBService)
//        {
//            _carCollection = mongoDBService.Database?.GetCollection<Car>("Cars");
//        }

//        [HttpPost("add")]
//        public IActionResult AddCar([FromBody] Car newCar)
//        {
//            if (newCar == null || string.IsNullOrEmpty(newCar.Id))
//            {
//                return BadRequest("Invalid car data.");
//            }

//            _carCollection.InsertOne(newCar);
//            return Ok(newCar);
//        }
//    }
//}
