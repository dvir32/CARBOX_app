using carbox.Date;
using carbox.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace carbox.Repositories
{
    public class StationRepository
    {
        private readonly IMongoCollection<Station> _stationsCollection;

        public StationRepository(MongoDBService mongoDBService)
        {
            _stationsCollection = mongoDBService.Database?.GetCollection<Station>("Stations");
        }

        public async Task<List<Station>> GetAllStationsAsync()
        {
            return await _stationsCollection.Find(_ => true).ToListAsync();
        }

        public async Task AddStationAsync(Station station)
        {
            await _stationsCollection.InsertOneAsync(station);
        }


    }
}
