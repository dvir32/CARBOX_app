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

        //הגעה לתחנה:
        //1. עדכון רשימת התחנות של הרכב
        //2. הורדת אחוזי סוללה


        //   רשימה של כל הרכבין הזמינים
        //   (הראשון הכי קרוב (למיין לפי המיקום
        // לעבור על הרשימה הממוינת עד שנמצא מישהו  מתאים (לפי מצב הסוללה וזמן ההגעה
        // אם אין רכב מתאים מחזירים את הרכבהכי קרוב להתאמה עם ההערה
        //


        //שיבוץ רכב 
        //// Assign the car to the ride order
        //rideOrder.AssignedCarId = nearestCar.Id;
        //    rideOrder.Status = RideOrderStatus.Assigned;
        // הוספת תחנה לרשימה מיון ועדכון רשימה



        // Assigns an available car to a ride order
        public async Task<RideOrder> AssignCarToRide(int rideOrderId)
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

            // Update car status to "Occupied"
            nearestCar.Status = CarStatus.Occupied;

            // Assign the car to the ride order
            rideOrder.AssignedCarId = nearestCar.Id;
            rideOrder.Status = RideOrderStatus.Assigned;

            // Save updates to the database
            await _carRepository.UpdateCarAsync(nearestCar);
            await _rideOrderRepository.UpdateRideAsync(rideOrder);

            return rideOrder; // Return the updated ride order
        }
    }
}

