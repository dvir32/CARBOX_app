import * as React from 'react';
import { useLocation } from "react-router-dom";
import './WeHaveSetOff.css'; // reuse the same CSS
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

function Arrived() {
  const location = useLocation();
  const { carId, destination } = location.state || {};

  return (
    <Box className="we-have-set-off-container">
      <Card className="we-have-set-off-card">
        <CardContent className="we-have-set-off-content">
          <DirectionsCarIcon className="car-icon" />

          <Typography variant="h5" className="message-text main-message">
            You have arrived at your destination
          </Typography>

          <Box className="carbox-details-box">
            <Typography variant="h6" className="carbox-id">
              CARBOX {carId}
            </Typography>
            <Typography variant="body1" className="route-info">
              Destination: {destination}
            </Typography>
          </Box>

          <Typography variant="body1" className="message-text sub-message">
            Please make sure you have not forgotten any belongings in the vehicle.
            Thank you and have a nice day!
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Arrived;
