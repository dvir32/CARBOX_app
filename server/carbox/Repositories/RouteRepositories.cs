using carbox.Models;
using MongoDB.Driver;
using System.Threading.Tasks;

namespace carbox.Repositories
{
    public class RouteRepository
    {
        private readonly IMongoCollection<Models.Route> _routes;

        public RouteRepository(IMongoDatabase database)
        {
            _routes = database.GetCollection<Models.Route>("Routes");
        }

        // Get a route by its ID
        public async Task<Models.Route> GetRouteByIdAsync(int routeId)
        {
            return await _routes.Find(route => route.Id == routeId).FirstOrDefaultAsync();
        }

        // Update an existing route
        public async Task UpdateRouteAsync(Models.Route route)
        {
            await _routes.ReplaceOneAsync(r => r.Id == route.Id, route);
        }
    }
}
