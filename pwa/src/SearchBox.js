
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useEffect,useState } from 'react';
import { useNavigate } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";
import './SearchBox.css';
import Map from './Map';

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
    const now = new Date();
    
    // Extract hours and minutes from the departureTime (which is in HH:MM format)
    const [hours, minutes] = departureTime.split(":"); 

    // Update the current date with the selected hours and minutes
    now.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0); 

    // Convert the local time to UTC by subtracting the timezone offset
    const offset = now.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
    const utcTime = new Date(now.getTime() - offset);

    // Format the date as ISO 8601 (YYYY-MM-DDTHH:MM:SSZ)
    const formattedRideTime = utcTime.toISOString(); // This ensures the time is in UTC

    console.log(formattedRideTime);


  

    fetch("https://localhost:7158/api/RideOrders", {
      method: "POST", 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          UserId: 50,
          Origin: originStation,
          Destination: destinationStation,
          RideTime: formattedRideTime
                }
              )
            })
    .then((response) => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Status updated:", data);
        // navigate('/LoadingPage', {
        //   state: {
        //     originStation: originStation,
        //     destinationStation:destinationStation,
        //     departureTime:departureTime
        //   }
        // });
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
    if (isFormValid){
      navigate('/LoadingPage', {
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
    <div><Map/></div>         
      

    </div>
  );
  
}

export default SearchBox; 