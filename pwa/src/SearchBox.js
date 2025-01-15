
import * as React from 'react';
import TextField from '@mui/material/TextField';
import { useEffect } from 'react';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './SearchBox.css';

function SearchBox() {
  const stationsList = ['A', 'B', 'C', 'D']
  const [originStation, setOriginStation] = useState('');
  const [destinationStation, setDestinationStation] = useState('');
  const [departureTime, setDepartureTime] = useState(''); // Add a state for the time

  useEffect(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setDepartureTime(`${hours}:${minutes}`);
  }, []);

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

    </div>
  );
  
}

export default SearchBox; 


