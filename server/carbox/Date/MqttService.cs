namespace carbox.Date
{
    using System;
    using System.Buffers;
    using System.Text;
    using System.Threading.Tasks;
    using carbox.Models;
    //using MongoDB.Bson.IO;
    using MongoDB.Driver;
    using MQTTnet;
    using Newtonsoft.Json;
    //using MQTTnet.Client;
    //using MQTTnet.Client.Options;

    public class MqttService : BackgroundService
    {
        private readonly IMqttClient _mqttClient;
        private readonly MqttClientOptions _mqttClientOptions;
        private readonly IMongoCollection<Car> _carCollection;

        public MqttService(MongoDBService mongoDBService)
        {
            // Create an MQTT client
            var mqttFactory = new MqttClientFactory();
            _mqttClient = mqttFactory.CreateMqttClient();

            // Configure connection options for the MQTT broker
            _mqttClientOptions = new MqttClientOptionsBuilder()
             .WithClientId("MQTTServer")
             .WithTcpServer("localhost", 1883) // MQTT broker address and port
             .Build();

            // Attach event handler for incoming messages
            _mqttClient.ApplicationMessageReceivedAsync += OnMessageReceived;

            // Connect to MongoDB and get the Cars collection
            _carCollection = mongoDBService.Database?.GetCollection<Car>("Cars");
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                // Connect to the MQTT broker
                await _mqttClient.ConnectAsync(_mqttClientOptions, stoppingToken);
                Console.WriteLine("Connected to MQTT broker.");

                // Configure subscription options for receiving car location updates
                var subscribeOptions = new MqttClientSubscribeOptionsBuilder()
                    .WithTopicFilter(f => { f.WithTopic("carbox/data/#"); }) // Subscribe to car location updates
                    .Build();

                // Subscribe to the specified MQTT topic
                await _mqttClient.SubscribeAsync(subscribeOptions, stoppingToken);
                Console.WriteLine("Subscribed to topic: carbox/data/#");

                // Keep the service running until stopped
                while (!stoppingToken.IsCancellationRequested)
                {
                    await Task.Delay(1000, stoppingToken);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in MQTT service: {ex.Message}");
            }
        }

        private async Task OnMessageReceived(MqttApplicationMessageReceivedEventArgs e)
        {
            // Extract and decode the incoming message payload
            var topic = e.ApplicationMessage.Topic;
            var payload = Encoding.UTF8.GetString(e.ApplicationMessage.Payload.ToArray());
            Console.WriteLine($"Received message from topic '{topic}': {payload}");

            try
            {
                // Deserialize the JSON payload into a CarLocationUpdate object
                var locationUpdate = JsonConvert.DeserializeObject<CarLocationUpdate>(payload);
                if (locationUpdate != null)
                {
                    await UpdateCarLocation(locationUpdate);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error parsing payload: {ex.Message}");
            }
        }

        private async Task UpdateCarLocation(CarLocationUpdate update)
        {
            // Create a filter to find the car by its ID
            var filter = Builders<Car>.Filter.Eq(c => c.Id, update.Id);

            // Define the update operation to set the new location
            var updateDefinition = Builders<Car>.Update
                .Set(c => c.Location, new Location { Latitude = update.Latitude, Longitude = update.Longitude });

            // Update the car's location in the database
            var result = await _carCollection.UpdateOneAsync(filter, updateDefinition);

            if (result.MatchedCount > 0)
            {
                Console.WriteLine($"Updated location for car ID {update.Id}");
            }
            else
            {
                Console.WriteLine($"Car ID {update.Id} not found in database.");
            }
        }
    }

    // Represents a car location update message received from MQTT
    public class CarLocationUpdate
    {
        public string Id { get; set; } // Unique identifier of the car
        public double Latitude { get; set; } // Latitude coordinate of the car's location
        public double Longitude { get; set; } // Longitude coordinate of the car's location
        public DateTime Timestamp { get; set; } // Timestamp of when the location update was received
    }
}
