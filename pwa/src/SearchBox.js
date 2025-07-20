  import * as React from 'react';
  import TextField from '@mui/material/TextField';
  import Box from '@mui/material/Box';
  import Button from '@mui/material/Button';
  import { useEffect,useState } from 'react';
  import { useNavigate } from "react-router-dom";
  import './SearchBox.css';
  import Map from './Map';
  import LoadingPage from './LoadingPage';
  import Card from '@mui/material/Card';
  import CardContent from '@mui/material/CardContent';
  import Container from '@mui/material/Container';
  import Typography from '@mui/material/Typography';
  import MenuItem from '@mui/material/MenuItem';

  function SearchBox() {

    const [stationsList, setStationsList] = useState([]);
    const [originStation, setOriginStation] = useState('');
    const [destinationStation, setDestinationStation] = useState('');
    const [departureTime, setDepartureTime] = useState(''); // Add a state for the time
    const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });  
    
    const navigate = useNavigate();

    useEffect(() => {
      // get the station
      fetch("https://carbox-server-new-1.onrender.com/api/stations", {
        method: "GET", 
        headers: {
          'Content-Type': 'application/json'
        }})
      .then((response) => {
          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }
          
          return response.json();
        })
        .then((data) => {
          console.log("Status updated:", data);
          setStationsList(data)
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
      //the defualt departure time is now
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setDepartureTime(`${hours}:${minutes}`);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude: latitude, longitude: longitude });
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        }, function (error) {
          console.error('Error getting location:', error);
        });
      }
      
    }, []);


    function handleClickNext () {
      const now = new Date();
      // Extract hours and minutes from the departureTime (which is in HH:MM format)
      const [hours, minutes] = departureTime.split(":"); 
      // Update the current date with the selected hours and minutes
      now.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0); 
      // Convert the local time to UTC by subtracting the timezone offset
      const offset = now.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
      const utcTime = new Date(now.getTime() - offset);
      // Format the date as ISO 8601 (YYYY-MM-DDTHH:MM:SSZ)
      const formattedTime = utcTime.toISOString(); // This ensures the time is in UTC
      const sourceStation = stationsList.find(item => item.name === originStation);
      const destStation = stationsList.find(item => item.name === destinationStation);
      navigate('/LoadingPage', {
        state: {
          originStation: originStation,
          destinationStation: destinationStation,
          departureTime: departureTime,
          rideOrder: {
            UserId: 50,
            source: sourceStation,
            Destination: destStation,
            RideTime: formattedTime
          }
        }
      });
    }

    const isFormValid = originStation !== '' && destinationStation !== ''; 


    return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
      }
    }}>
      <Container maxWidth="sm">
        <Card sx={{ 
          p: 4, 
          borderRadius: 4, 
          boxShadow: '0 20px 40px rgba(13, 71, 161, 0.2)',
          background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)',
          }
        }}>
          <CardContent>
            <Typography 
              variant="h4" 
              align="center" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: '#0d47a1',
                textShadow: '0 2px 4px rgba(13, 71, 161, 0.1)',
                mb: 3
              }}
            >
              Search for a Ride
            </Typography>
            <Box id='search-box'>
              <TextField
                className="search-field"
                select
                label="Select your origin"
                value={originStation}
                onChange={(e) => setOriginStation(e.target.value)}
                sx={{ 
                  mb: 2, 
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0d47a1',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0d47a1',
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Select your origin
                </MenuItem>
                {stationsList.map((station) => (
                  <MenuItem key={station.name} value={station.name}>
                    {station.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                className="search-field"
                select
                label="Select your destination"
                value={destinationStation}
                onChange={(e) => setDestinationStation(e.target.value)}
                sx={{ 
                  mb: 2, 
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0d47a1',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0d47a1',
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Select your destination
                </MenuItem>
                {stationsList.map((station) => (
                  <MenuItem key={station.name} value={station.name}>
                    {station.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                className="search-field"
                id="outlined-time"
                type="time"
                label="Select departure time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                sx={{ 
                  mb: 2, 
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0d47a1',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0d47a1',
                    },
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Button
                  onClick={handleClickNext}
                  disabled={!isFormValid}
                  sx={{
                    background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
                    color: '#fff',
                    borderRadius: 3,
                    boxShadow: '0 8px 25px rgba(13, 71, 161, 0.4)',
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0a3d8f 0%, #0d47a1 100%)',
                      boxShadow: '0 12px 35px rgba(13, 71, 161, 0.5)',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      background: '#e0e0e0',
                      color: '#9e9e9e',
                      boxShadow: 'none',
                      transform: 'none',
                    },
                  }}
                >
                  Next
                </Button>
              </Box>
              <div><Map stations={stationsList} userLocation={userLocation}/></div>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
    
  }

  export default SearchBox; 