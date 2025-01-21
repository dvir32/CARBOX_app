namespace carbox.Date
{
    using MongoDB.Driver;

    public class MongoDBService
    {
        private readonly IConfiguration _configuration;
        private readonly IMongoDatabase? _database;

        public MongoDBService(IConfiguration config)
        {
            _configuration = config;

            var connectionStrint = _configuration.GetConnectionString("DbConnection");
            var mongoUrl = MongoUrl.Create(connectionStrint);
            var mongoClient = new MongoClient(mongoUrl);
            _database = mongoClient.GetDatabase("carboxDB");
            Console.WriteLine("_database: " + _database);
        }

        public IMongoDatabase? Database => _database;
    }

}
