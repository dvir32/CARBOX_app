using carbox.Date;
using carbox.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace carbox.Repositories
{
    public class CarRepository
    {
        private readonly IMongoCollection<Car> _carCollection;

        // Constructor: Initialize MongoDB collection
        public CarRepository(MongoDBService mongoDBService)
        {
            _carCollection = mongoDBService.Database?.GetCollection<Car>("Cars");
        }

        // Add a new car to the database
        public async Task AddCarAsync(Car car)
        {
            await _carCollection.InsertOneAsync(car);
        }

        // Get a car by ID
        public async Task<Car> GetCarByIdAsync(string id)
        {
            return await _carCollection.Find(car => car.Id == id).FirstOrDefaultAsync();
        }

        // Get all available cars
        public async Task<List<Car>> GetAvailableCarsAsync()
        {
            return await _carCollection.Find(car => car.Status == CarStatus.Available).ToListAsync();
        }

        // Update an existing car in the database
        public async Task UpdateCarAsync(Car car)
        {
            await _carCollection.ReplaceOneAsync(c => c.Id == car.Id, car);
        }
    }
}
