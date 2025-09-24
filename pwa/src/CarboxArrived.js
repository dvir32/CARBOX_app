
import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import './CarboxArrived.css';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function CarboxArrived() {
  const location = useLocation();
  const navigate = useNavigate();
  const { originStation, destinationStation, departureTime, rideOrder, userID, travelMinutes } = location.state || {};
  console.log("CarboxArrived - travelMinutes:", travelMinutes);

  const handleNext = () => {
    navigate('/FindingCarbox', {
      state: {
        originStation,
        destinationStation,
        departureTime,
        rideOrder,
        userID,
        travelMinutes: rideOrder?.travelMinutes
      }
    });
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)',
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
    }} className="carbox-arrived-container">
      <Card sx={{
        minWidth: 320,
        maxWidth: 400,
        borderRadius: 4,
        boxShadow: '0 20px 40px rgba(13, 71, 161, 0.2)',
        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden',
        p: 3,
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
        <CardContent sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <CheckCircleIcon 
            className="check-icon"
            sx={{ 
              fontSize: 80, 
              color: '#4caf50', 
              mb: 2,
              filter: 'drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3))'
            }} 
          />
          <Typography 
            variant="h5" 
            className="message-text"
            sx={{ 
              mb: 3, 
              color: '#0d47a1', 
              fontWeight: 'bold',
              lineHeight: 1.3
            }}
          >
            Your CARBOX has arrived at the departure station
          </Typography>
          <Typography 
            variant="body1" 
            className="message-text"
            sx={{ 
              mb: 4, 
              color: '#666',
              lineHeight: 1.5
            }}
          >
            Please proceed to the station to begin your journey
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleNext}
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
            Next
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CarboxArrived; 


