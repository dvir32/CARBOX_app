using carbox.Models;
using carbox.Repositories;
using System;
using System.Threading.Tasks;
using System.Text.Json;
using System.Collections.Generic;

namespace carbox.Services
{
    // Service class responsible for handling ride order logic, such as assigning a car
    public class RideService
    {
        private readonly RideOrderRepository _rideOrderRepository; // Database repository for ride orders
        private readonly CarRepository _carRepository; // Database repository for cars
        private readonly StationRepository _stationRepository;
        private readonly RouteRepository _routeRepository;
        //private readonly RouteService _routeService;
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
            car.StopStations = car.StopStations.OrderBy(s => s.Id).ToList(); // Example sorting logic

            // Update car status to "Occupied"
            car.Status = CarStatus.Occupied;

            await _carRepository.UpdateCarAsync(car);
            return rideOrder;
        }

        public async Task<RideOrder> SearchCarToRide(int rideOrderId)
        {
            var rideOrder = await _rideOrderRepository.GetRideByIdAsync(rideOrderId);
            if (rideOrder == null || rideOrder.Status != RideOrderStatus.Open)
                throw new InvalidOperationException("Ride order not found or not open");

            //  בדיקה אם הנסיעה היא נסיעה עתידית או מיידית (טווח של רבע שעה)
            bool isFutureRide = rideOrder.RideTime > DateTime.Now.AddMinutes(15);

            // Get all available cars
            var availableCars = await _carRepository.GetAvailableCarsAsync();
            var selectedCar = availableCars.FirstOrDefault();

            if (!isFutureRide)
            { 

                if (!availableCars.Any())
                    throw new InvalidOperationException("No available cars at the moment");

                // Filter cars with battery percentage higher than 40%
                var carsWithSufficientBattery = availableCars.Where(car => car.BatteryLevel > 40).ToList();
                if (!carsWithSufficientBattery.Any())
                    throw new InvalidOperationException("No cars with sufficient battery available");

                // Get the route information
                var route = await _routeRepository.GetRouteByIdAsync(rideOrder.RouteId);
                if (route == null || !route.Stations.Any())
                    throw new InvalidOperationException("Route not found or has no stations");

                // Get the requested station index
                int requestedStationIndex = route.Stations.FindIndex(s => s.Id == rideOrder.PickupStationId);
                if (requestedStationIndex == -1)
                    throw new InvalidOperationException("Requested station not found in the route");

                int totalStations = route.Stations.Count;

                // Sort cars by their last station in descending and circular order from the requested station
                var sortedCars = carsWithSufficientBattery
                    .Select(car => {
                        int carStationIndex = route.Stations.FindIndex(s => s.Id == car.LastStationId);
                        if (carStationIndex == -1) return null; // Skip cars not on this route

                        // Calculate the circular distance from car's station to the requested station
                        int distance;
                        if (carStationIndex <= requestedStationIndex)
                        {
                            distance = requestedStationIndex - carStationIndex;
                        }
                        else
                        {
                            distance = requestedStationIndex + (totalStations - carStationIndex);
                        }

                        return new { Car = car, Distance = distance };
                    })
                    .Where(item => item != null)
                    .OrderBy(item => item.Distance)
                    .Select(item => item.Car)
                    .ToList();

                if (!sortedCars.Any())
                    throw new InvalidOperationException("No suitable cars near the requested station");

                // Select the first car in the sorted list
                selectedCar = sortedCars.First();
            }

            else
            {
                var Cars = await _carRepository.GetAllCarsAsync();

                var filteredCars = Cars.Where(car =>
                    //בדיקה שאין חפיפה עם נסיעות אחרות
                    !car.ScheduledTrips.Any(trip =>
                        rideOrder.RideTime < trip.EndTime && rideOrder.RideTime.AddMinutes(rideOrder.EstimatedDuration) > trip.StartTime)

                    //עדיפות לרכבים עם פחות עומס
                    && car.ScheduledTrips.Count < 5
            ).OrderBy(car => car.ScheduledTrips.Count).ToList();
                selectedCar = filteredCars.First();



            }

            // Update the ride with the selected car
            AssignCarToRide(selectedCar, rideOrder);

            return rideOrder;
        }


        //public async Task<RideOrder> SearchCarToRide(int rideOrderId)
        //{
        //    var rideOrder = await _rideOrderRepository.GetRideByIdAsync(rideOrderId);

        //    if (rideOrder == null || rideOrder.Status != RideOrderStatus.Open)
        //        throw new InvalidOperationException("Ride order not found or not open");

        //    var availableCars = await _carRepository.GetAvailableCarsAsync();

        //    if (!availableCars.Any())
        //        throw new InvalidOperationException("No available cars at the moment");

        //    // מיון הרכבים לפי המרחק במסלול החד כיווני
        //    var nearestCar = FindNearestCarInCircularRoute(availableCars, rideOrder.source);

        //    // עדכון הנסיעה עם הרכב שנבחר
        //    AssignCarToRide(nearestCar.Result, rideOrder);
        //    //rideOrder.CarId = nearestCar.Id;
        //    //rideOrder.Status = RideOrderStatus.CarAssigned;
        //    //await _rideOrderRepository.UpdateRideAsync(rideOrder);

        //    return rideOrder;
        //}

        private async Task<Car> FindNearestCarInCircularRoute(List<Car> availableCars, Station source)
        {
            return await CalculateDistanceInCircularRoute(availableCars, source);

        }

        private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            double R = 6371; 
            double dLat = (lat2 - lat1) * Math.PI / 180;
            double dLon = (lon2 - lon1) * Math.PI / 180;
            double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                       Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180) *
                       Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c; // מרחק בקילומטרים
        }


        //private async Task<List<Car> CalculateDistanceInCircularRoute(List<Car> availableCars, Station source)
        private async Task<Car> CalculateDistanceInCircularRoute(List<Car> availableCars, Station source)
        {
            //רשימת הרכבים לפי הקרבה לתחנת המוצא
            availableCars = (List<Car>)availableCars.OrderBy(car => CalculateDistance(car.Location.Latitude, car.Location.Longitude, source.Location.Latitude, source.Location.Longitude));

            // הגדרת סדר התחנות במסלול
            //var stations = new[] { Station.A, Station.B, Station.C, Station.D };
            var stations_json = await _stationRepository.GetAllStationsAsync();
            List<Station> stations = (List<Station>)stations_json.OrderBy(station => station.Id);

            return availableCars.FirstOrDefault();
            //var carIndex = Array.IndexOf(stations, carStation);
            //var pickupIndex = Array.IndexOf(stations, pickupStation);

            //if (carIndex == pickupIndex) return 0;

            //// חישוב המרחק בכיוון התנועה
            //if (carIndex < pickupIndex)
            //{
            //    return pickupIndex - carIndex;
            //}
            //else
            //{
            //    // אם הרכב אחרי נקודת האיסוף, צריך להשלים סיבוב
            //    return (stations.Length - carIndex) + pickupIndex;
            //}
        }

    }
}






//        public async Task<RideOrder> SearchCarToRide(int rideOrderId)
//        {
//            // Fetch the ride order by ID
//            var rideOrder = await _rideOrderRepository.GetRideByIdAsync(rideOrderId);

//            // Check if the ride order exists and is open
//            if (rideOrder == null || rideOrder.Status != RideOrderStatus.Open)
//                throw new Exception("Ride order not found or not open");

//            // Retrieve available cars from the database
//            var availableCars = await _carRepository.GetAvailableCarsAsync();

//            // Select the first available car (this can be improved to find the closest car)
//            var nearestCar = availableCars.FirstOrDefault();

//            // If no cars are available, throw an error
//            if (nearestCar == null)
//                throw new Exception("No available cars at the moment");
            
//            return rideOrder; // Return the updated ride order
//        }
//    }
//}

