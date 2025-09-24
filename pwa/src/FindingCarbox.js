import React, { useEffect, useState } from 'react';
import './FindingCarbox.css';
import CarboxCard from './CarboxCard';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import { formatTimestamp } from './utils/dateFormatter';

function FindingCarbox() {
  const location = useLocation();
  const rideOrder = location.state?.rideOrder?.result || location.state?.rideOrder;
  const travelMinutes = location.state?.travelMinutes;
  const [ride, setRide] = useState(null);
  const [error, setError] = useState(null);
  const [arrival, setArrivalTime] = useState(null);

  useEffect(() => {
    // Use ride data from rideOrder directly
    if (rideOrder?.ride) {
      setRide(rideOrder.ride);
      setArrivalTime(rideOrder.arrival);
    } else {
      setError('Ride data is missing.');
    }
  }, [rideOrder]);

  // Format the timestamps
  const formattedDepartureTime = ride ? formatTimestamp(ride.rideTime) : '...';
  const formattedArrivalTime = arrival ? formatTimestamp(arrival) : '...';

  // Debug logging
  console.log('FindingCarbox - travelMinutes:', travelMinutes);

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
      background: 'radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
      pointerEvents: 'none',
    }
  }}></Box>;

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
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
        {ride ? 'We found a carbox for you' : 'Searching for a carbox...'}
      </Typography>
      <CarboxCard
        id={ride ? ride.assignedCarId : '...'}
        origin={ride ? ride.source.name : '...'}
        destination={ride ? ride.destination.name : '...'}
        departureTime={formattedDepartureTime}
        arrivalTime={formattedArrivalTime}
      />
    </Box>
  );
}

export default FindingCarbox;
