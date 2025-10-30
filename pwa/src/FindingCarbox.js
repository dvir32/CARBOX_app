import React from 'react';
import './FindingCarbox.css';
import CarboxCard from './CarboxCard';
import { useLocation } from "react-router-dom";
import { Box, Typography } from '@mui/material';
import { formatTimestamp } from './utils/dateFormatter';

function FindingCarbox() {
  const location = useLocation();

  // Everything you passed from CarboxArrived:
  const {
    rideId,
    originStation,
    destinationStation,
    departureTime,     // ← this is the "as wanted" time
    rideOrder,
    userID,            // kept in case you need it later
    travelMinutes: travelMinutesFromState
  } = location.state || {};

  // Data that may also come from the backend response you put under rideOrder
  const ride    = rideOrder?.ride ?? null;
  const arrival = rideOrder?.arrival ?? null;

  // Prefer values from navigation state; fallback to backend fields if missing
  const chosenDepartureTs = departureTime ?? ride?.rideTime ?? null;
  const travelMinutes =
    travelMinutesFromState ?? rideOrder?.travelMinutes ?? undefined;

  // Format for display
  const formattedDepartureTime = chosenDepartureTs ? formatTimestamp(chosenDepartureTs) : '...';
  const formattedArrivalTime   = arrival ? formatTimestamp(arrival) : '...';

  // Early guards / nice UI states
  if (!location.state) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)'
      }}>
        <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>
          Error: Missing navigation state
        </Typography>
      </Box>
    );
  }

  if (!rideOrder) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)'
      }}>
        <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>
          Error: Ride data is missing.
        </Typography>
      </Box>
    );
  }

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
        background:
          'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%), ' +
          'radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
      }
    }}>
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: 'bold', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
      >
        {ride ? 'We found a carbox for you' : 'Searching for a carbox...'}
      </Typography>

      <CarboxCard
        id={ride?.assignedCarId ?? '...'}
        origin={originStation?.name ?? ride?.source?.name ?? '...'}
        destination={destinationStation?.name ?? ride?.destination?.name ?? '...'}
        departureTime={formattedDepartureTime}
        arrivalTime={formattedArrivalTime}
        travelMinutes={travelMinutes}
        rideId={rideId}
      />
    </Box>
  );
}

export default FindingCarbox;
