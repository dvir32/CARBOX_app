
namespace carbox.Models
{
    public class Car
    {
        public string Id { get; set; }  // Vehicle identifier
        public CarStatus Status { get; set; }  // Status (Available/Occupied)
        public Location Location { get; set; }  // Vehicle location
        public double BatteryPercentage { get; set; } // Battery percentage
        public List<string> StopStations { get; set; } = new List<string>(); // List of stop stations
    }

    public enum CarStatus
    {
        Available=0 ,  // Available
        Occupied =1 ,   // Occupied
        Maintenance =2 
    }
}
