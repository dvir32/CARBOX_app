using MongoDB.Bson.Serialization.Attributes;

namespace carbox.Models
{
    public class Station
    {
        [BsonElement("_id")]
        public int Id { get; set; }  // Station identifier
        public string Name { get; set; }  // Station name
        public Location Location { get; set; }  // Station location
    }
}
