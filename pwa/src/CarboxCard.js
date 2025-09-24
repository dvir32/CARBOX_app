import * as React from 'react';
import { useNavigate } from "react-router-dom";
import './CarboxCard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { formatTimestamp } from './utils/dateFormatter';

function CarboxCard(props) {
  const navigate = useNavigate();
  const id = props.id;
  const origin = props.origin;
  const destination = props.destination;
  const departureTime = props.departureTime;
  const arrivalTime = props.arrivalTime;
  const travelMinutes = props.travelMinutes;

  // Format timestamps for navigation to WeHaveSetOff
  const formattedDepartureTime = formatTimestamp(departureTime);
  const formattedArrivalTime = formatTimestamp(arrivalTime);

  // Debug logging
  console.log('CarboxCard - Received departureTime:', departureTime);
  console.log('CarboxCard - Received arrivalTime:', arrivalTime);
  console.log('CarboxCard - Formatted departureTime:', formattedDepartureTime);
  console.log('CarboxCard - Formatted arrivalTime:', formattedArrivalTime);
  console.log('CarboxCard - travelMinutes:', travelMinutes);

  const handleStartClick = async () => {
    try {
      console.log("car id is: " + id);
      console.log("car id type is: " + typeof id);
      const response = await fetch('https://carbox-server-new-1.onrender.com/api/StartStop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ CarId: id, status: "2" }),
      });
      if (!response.ok) {
        let errorMsg = 'Unknown error';
        try {
          const text = await response.text();
          try {
            const errorData = JSON.parse(text);
            errorMsg = errorData.message || response.status;
          } catch {
            errorMsg = text;
          }
        } catch (e) {
          errorMsg = response.status;
        }
        alert('Failed to update car status: ' + errorMsg);
      } else {
        // Navigate to the new page instead of showing alert
        navigate('/WeHaveSetOff', {
          state: {
            carId: id,
            origin: origin,
            destination: destination,
            departureTime: formattedDepartureTime,
            arrivalTime: formattedArrivalTime,
            travelMinutes: travelMinutes
          }
        });
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
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
        <CardHeader
          title={<Typography variant="subtitle1" sx={{ color: '#0d47a1', fontWeight: 600 }}>Departure: <strong>{departureTime}</strong> | <br></br>Arrival: <strong>{arrivalTime}</strong></Typography>}
          sx={{ 
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderBottom: '1px solid rgba(13, 71, 161, 0.1)'
          }}
        />
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: '#0d47a1' }}>CARBOX <strong>{id}</strong></Typography>
          <Typography variant="body1" sx={{ mb: 2, color: '#424242' }}>{origin} <span style={{ fontWeight: 'bold', color: '#0d47a1' }}>→</span> {destination}</Typography>
          <Button
            variant="contained"
            onClick={handleStartClick}
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
            }}
          >
            START
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CarboxCard; 


