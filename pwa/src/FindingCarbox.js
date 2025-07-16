import React, { useEffect, useState } from 'react';
import './FindingCarbox.css';
import CarboxCard from './CarboxCard';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { Box, Typography } from '@mui/material';

function FindingCarbox() {
  const location = useLocation();
  const rideOrder = location.state?.rideOrder?.result || location.state?.rideOrder;
  const [ride, setRide] = useState(null);
  const [error, setError] = useState(null);
  const [arrival, setArrivalTime] = useState(null);

  useEffect(() => {
    console.log("useEffect ran", rideOrder);

    async function assignCar() {
      console.log("rideOrder.ride.id ", rideOrder.ride.id);
      try {
        const response = await axios.post(`https://carbox-server-new-1.onrender.com/api/RideOrders/${rideOrder.ride.id}/assign`);
        console.log(response);
        setRide(response.data.ride);
        setArrivalTime(response.data.arrival);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      }
    }

    if (rideOrder?.ride) {
      assignCar();
    } else {
      console.log("rideOrder is missing or id is undefined");
    }
  }, [rideOrder]);



  if (error) return <Box sx={{ 
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
  }}><Typography color="error" sx={{ color: '#fff', fontWeight: 'bold' }}>Error: {error}</Typography></Box>;
  if (!ride) return <Box sx={{ 
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
  }}><Typography sx={{ color: '#fff', fontWeight: 'bold' }}>Looking for a carbox...</Typography></Box>;

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
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
    }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>We found a carbox for you</Typography>
      <CarboxCard
        id={ride.assignedCarId}
        origin={ride.source.name}
        destination={ride.destination.name}
        departureTime={ride.rideTime}
        arrivalTime={arrival}
      />
    </Box>
  );
}

export default FindingCarbox;
