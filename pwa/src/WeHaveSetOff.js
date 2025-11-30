import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import './WeHaveSetOff.css';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { formatTimestamp } from './utils/dateFormatter';

function WeHaveSetOff() {
  const location = useLocation();
  const navigate = useNavigate();
  const { carId, origin, destination, departureTime, arrivalTime, travelMinutes } = location.state || {};

  // Format timestamps
  const formattedDepartureTime = formatTimestamp(departureTime);
  const formattedArrivalTime = formatTimestamp(arrivalTime);

  React.useEffect(() => {
  if (!travelMinutes) {
    console.warn("travelMinutes missing, defaulting to 10s");
    return;
  }

  console.log("Waiting", travelMinutes, "seconds before polling...");

  const waitTimer = setTimeout(() => {
    console.log("Starting to poll car status...");

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`https://carbox-server-new-1.onrender.com/api/Car/${carId}`);
        if (!response.ok) {
          console.error("Failed to fetch car:", response.status);
          return;
        }

        const car = await response.json();
        console.log("Polled car:", car);

        if (car.status === 0) {
          console.log("Car status is 0 → navigating to /arrived");
          clearInterval(pollInterval);
          navigate("/arrived", { state: { carId, origin, destination, arrivalTime } });
        }
      } catch (err) {
        console.error("Error while polling car:", err);
      }
    }, 5000);

    // cleanup when unmounting
    return () => clearInterval(pollInterval);
  }, 1000 * travelMinutes);

  return () => clearTimeout(waitTimer);
}, [navigate, carId, origin, destination, arrivalTime, travelMinutes]); 

  return (
    <Box className="we-have-set-off-container">
      <Card className="we-have-set-off-card">
        <CardContent className="we-have-set-off-content">
          <DirectionsCarIcon className="car-icon" />
          
          <Typography variant="h5" className="message-text main-message">
            We have set off, please wait until you arrive at your destination station
          </Typography>
          
          {/* Carbox details */}
          <Box className="carbox-details-box">
            <Typography variant="h6" className="carbox-id">
              Lynx {carId}
            </Typography>
            <Typography variant="body1" className="route-info">
              {origin} <span className="route-arrow">→</span> {destination}
            </Typography>
            <Typography variant="body2" className="timing-info">
              Departure: {formattedDepartureTime} | <br />
              Arrival: {formattedArrivalTime}
            </Typography>
          </Box>

          <Typography variant="body1" className="message-text sub-message">
            Your journey is now in progress. Sit back and relax!
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default WeHaveSetOff;
