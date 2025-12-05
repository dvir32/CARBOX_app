import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import './WeHaveSetOff.css'; // reuse the same CSS
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

function Arrived() {
  const location = useLocation();
  const navigate = useNavigate();
  const { carId, destination } = location.state || {};

  const handleBackToSearch = () => {
    navigate('/SearchBox');
  };

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

          <Button
            variant="contained"
            size="large"
            onClick={handleBackToSearch}
            className="next-button"
            sx={{
              background: 'linear-gradient(45deg, #0d47a1 30%, #1565c0 90%)',
              borderRadius: 3,
              padding: '12px 32px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: '0 4px 15px rgba(13, 71, 161, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                boxShadow: '0 6px 20px rgba(13, 71, 161, 0.4)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            Find Another Ride
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Arrived;
