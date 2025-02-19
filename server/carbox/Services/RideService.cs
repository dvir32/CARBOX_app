using carbox.Models;
using carbox.Repositories;
using System;
using System.Threading.Tasks;

namespace carbox.Services
{
    // Service class responsible for handling ride order logic, such as assigning a car
    public class RideService
    {
        private readonly RideOrderRepository _rideOrderRepository; // Database repository for ride orders
        private readonly CarRepository _carRepository; // Database repository for cars
        Random rnd = new Random();

        // Constructor - injects repositories
        public RideService(RideOrderRepository rideOrderRepository, CarRepository carRepository)
        {
            _rideOrderRepository = rideOrderRepository;
            _carRepository = carRepository;
        }

        // Adds a new ride order to the database
        public async Task<RideOrder> CreateRideOrderAsync(RideOrder rideOrder)
        {
            if (rideOrder == null)
                throw new ArgumentNullException(nameof(rideOrder));


            rideOrder.Id = rnd.Next(); // Ensure ID is set
            rideOrder.CreatedAt = DateTime.UtcNow;
            rideOrder.Status = RideOrderStatus.Open; // Default status

            await _rideOrderRepository.CreateRideOrderAsync(rideOrder);
            return rideOrder;
        }

        // Arrival at a station:
        // 1. Update the car's station list
        // 2. Decrease battery percentage
        public async Task ArriveAtStationAsync(string carId, Station station)
        {
            var car = await _carRepository.GetCarByIdAsync(carId);
            if (car == null) return;

            car.StopStations.Remove(station);

            if (station.Id == 0)
                car.BatteryLevel = 100;
            else 
                car.BatteryLevel -= 10; // Example battery consumption
            await _carRepository.UpdateCarAsync(car);
        }
       
        public async Task<RideOrder> AssignCarToRide(Car car, RideOrder rideOrder)
        {
            // Assign the car to the ride order
            rideOrder.AssignedCarId = car.Id;
            rideOrder.Status = RideOrderStatus.Assigned;

            // Save rideOrder updates to the database
            await _rideOrderRepository.UpdateRideAsync(rideOrder);


            Station newStation = rideOrder.Destination;


            // Add station to list, sort and update
            car.StopStations.Add(newStation);
            car.StopStations = car.StopStations.OrderBy(static s => int.TryParse(s.Id, out int id) ? id : int.MaxValue).ToList(); // Example sorting logic

            // Update car status to "Occupied"
            car.Status = CarStatus.Occupied;

            await _carRepository.UpdateCarAsync(car);
            return rideOrder;
        }


        public async Task<RideOrder> SearchCarToRide(int rideOrderId)
        {
            // Fetch the ride order by ID
            var rideOrder = await _rideOrderRepository.GetRideByIdAsync(rideOrderId);

            // Check if the ride order exists and is open
            if (rideOrder == null || rideOrder.Status != RideOrderStatus.Open)
                throw new Exception("Ride order not found or not open");

            // Retrieve available cars from the database
            var availableCars = await _carRepository.GetAvailableCarsAsync();

            // Select the first available car (this can be improved to find the closest car)
            var nearestCar = availableCars.FirstOrDefault();

            // If no cars are available, throw an error
            if (nearestCar == null)
                throw new Exception("No available cars at the moment");
            
            return rideOrder; // Return the updated ride order
        }
    }
}

