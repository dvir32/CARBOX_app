
namespace carbox.Models
{
    public class Car
    {
        public string Id { get; set; }  // Vehicle identifier
        public CarStatus Status { get; set; }  // Status (Available/Occupied)
        public Location Location { get; set; }  // Vehicle location
        public double BatteryLevel { get; set; } // Battery percentage
        public List<Station> StopStations { get; set; } = new List<Station>(); // List of stop stations
        public Station LastStation { get; set; } // Last station the car was at
        public int RouteId { get; set; }

        //public int lastStation()
        //{
        //    return StopStations[0].Id - 1;
        //}
    }

    public enum CarStatus
    {
        Available=0 ,  // Available
        Occupied =1 ,   // Occupied
        Maintenance =2 
    }
}
