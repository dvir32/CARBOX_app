using System.Collections.Generic;
using System.Threading.Tasks;
using carbox.Models;
using carbox.Repositories;

public class RouteService
{
    private readonly StationRepository _stationRepository;
    private int _totalStations = -1; // משתנה לשמירת מספר התחנות

    public RouteService(StationRepository stationRepository)
    {
        _stationRepository = stationRepository;
    }

    public async Task<int> GetTotalStationsAsync()
    {
        // אם כבר חישבנו את מספר התחנות, נחזיר אותו בלי לפנות שוב ל-DB
        if (_totalStations != -1)
            return _totalStations;

        // שליפה מה-DB
        List<Station> stations = await _stationRepository.GetAllStationsAsync();

        // שמירת מספר התחנות בזיכרון למניעת שאילתות חוזרות
        _totalStations = stations.Count;

        return _totalStations;
    }
}
