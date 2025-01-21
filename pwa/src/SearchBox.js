
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


  useEffect(() => {
    //the defualt departure time is now
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setDepartureTime(`${hours}:${minutes}`);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      }, function (error) {
        console.error('Error getting location:', error);
      });
    }
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


