
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useEffect,useState } from 'react';
import { useNavigate } from "react-router-dom";
import './SearchBox.css';

function SearchBox() {

  const stationsList = ['A', 'B', 'C', 'D']
  const [originStation, setOriginStation] = useState('');
  const [destinationStation, setDestinationStation] = useState('');
  const [departureTime, setDepartureTime] = useState(''); // Add a state for the time
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });


  // Parse the GNSS file content and extract the coordinates
  const gnssData = `$GPGGA,130504.037,3204.300,N,03450.786,E,1,12,1.0,0.0,M,0.0,M,,*64
$GPGSA,A,3,01,02,03,04,05,06,07,08,09,10,11,12,1.0,1.0,1.0*30
$GPRMC,130504.037,A,3204.300,N,03450.786,E,,,260125,000.0,W*72`;
    
  // Convert the coordinate in DDMM.MMMM format to decimal degrees
  const parseGNSSData = (data) => {
    const gpggaPattern = /^\$GPGGA,(\d{6}\.\d{3}),(\d{2})(\d{2}\.\d{3}),([NS]),(\d{3})(\d{2}\.\d{3}),([EW])/;
    const match = data.match(gpggaPattern);

    if (match) {
      const latitudeDegrees = parseInt(match[2], 10);
      const latitudeMinutes = parseFloat(match[3]);
      const latitudeHemisphere = match[4];
      const longitudeDegrees = parseInt(match[5], 10);
      const longitudeMinutes = parseFloat(match[6]);
      const longitudeHemisphere = match[7];

      const latitude = latitudeDegrees + latitudeMinutes / 60;
      const longitude = longitudeDegrees + longitudeMinutes / 60;

      const finalLatitude = latitudeHemisphere === 'S' ? -latitude : latitude;
      const finalLongitude = longitudeHemisphere === 'W' ? -longitude : longitude;

      return {
        latitude: finalLatitude,
        longitude: finalLongitude,
      };
    } else {
      return null;
    }
  };
  

  useEffect(() => {
    //the defualt departure time is now
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setDepartureTime(`${hours}:${minutes}`);
    const position = parseGNSSData(gnssData);
    console.log(position);
    setUserLocation({ lat: position.latitude, lng: position.longitude });
    //if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(function (position) {
    //     const { latitude, longitude } = position.coords;
    //     setUserLocation({ lat: latitude, lng: longitude });
    //     console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    //   }, function (error) {
    //     console.error('Error getting location:', error);
    //   });
    // }
    
  }, []);

  const navigate = useNavigate();

  const handleClickNext = () => {
    if (isFormValid){
      navigate('/RealTimePage', {
        state: {
          originStation: originStation,
          destinationStation:destinationStation,
          departureTime:departureTime
        }
      });
    }
    
  };

  const isFormValid = originStation !== '' && destinationStation !== ''; 
  const mapLocation = userLocation.lat && userLocation.lng ? userLocation : { lat: 32.0853, lng: 34.7818 }; // Default to Tel Aviv

  return (
    
    <div id='search-box'>

    <TextField
        className="search-field"
        id="outlined-select-currency-native"
        select
        label="Select your origin"
        value={originStation} // Set value to originStation state
        onChange={(e) => setOriginStation(e.target.value)} // Update state on change
        slotProps={{
          select: {
            native: true,
          },
        }}
      >
        {/* Add a default option as a placeholder */}
        <option value="" disabled>
        </option>
        {stationsList.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </TextField>

      <TextField
        className="search-field"
        id="outlined-select-currency-native"
        select
        label="Select your destination"
        value={destinationStation} // Set value to originStation state
        onChange={(e) => setDestinationStation(e.target.value)} // Update state on change
        slotProps={{
          select: {
            native: true,
          },
        }}
      >
        {/* Add a default option as a placeholder */}
        <option value="" disabled>
        </option>
        {stationsList.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </TextField>
      <TextField
        className="search-field"
        id="outlined-time"
        type="time"
        label="Select departure time"
        value={departureTime}
        onChange={(e) => setDepartureTime(e.target.value)}
        InputLabelProps={{
          shrink: true, // Ensures the label stays above the input
        }}
        inputProps={{
          step: 300, // Adjust step for time format (in seconds)
        }}
      />
      <Box sx={{ flex: '1 1 auto' }} />
      <Button onClick={handleClickNext}
      sx={{ mr: 1 }}
      disabled={!isFormValid} // Disable the button if form is invalid
    >
      Next
    </Button>
    <div><iframe
    width="100%"
    height="600"
    frameBorder="0"
    scrolling="no"
    marginHeight="0"
    marginWidth="0"
    src={`https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${mapLocation.lat},${mapLocation.lng}&t=&z=14&ie=UTF8&iwloc=B&output=embed`}
  >
    <a href="https://www.gps.ie/">gps trackers</a>
  </iframe></div>         
      

    </div>
  );
  
}

export default SearchBox; 


