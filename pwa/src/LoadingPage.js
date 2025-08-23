import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";
import './LoadingPage.css';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';

function LoadingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Ride order passed from SearchBox (no `.ride` field initially)
  const rideOrder = location.state?.rideOrder;
  const originStation = location.state?.originStation;
  const destinationStation = location.state?.destinationStation;
  const departureTime = location.state?.departureTime;
  const userID = location.state?.userID;

  useEffect(() => {
    async function createAndAssignCar() {
      let rideOrderToUse = rideOrder;
      let rideId;

      console.log("Starting createAndAssignCar with rideOrder:", rideOrder);

      try {
        // 1. Create ride order if it doesn’t have an ID yet
        if (!rideOrder?.id) {
          console.log("Creating new ride order because id is missing");
          const response = await fetch('https://carbox-server-new-1.onrender.com/api/RideOrders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rideOrder)
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || 'Failed to create ride order');
          }

          console.log("API Response data:", data);

          // Get ride ID from server response
          rideId = data.ride?.id || data.id;
          rideOrderToUse = data.ride || data;

          if (!rideId) {
            throw new Error('Invalid response structure: no ride ID found');
          }
        } else {
          // Use existing ride order
          console.log("Using existing ride order with ID:", rideOrder.id);
          rideId = rideOrder.id;
        }

        console.log("Final rideId:", rideId);

        // 2. Assign car
        const assignResponse = await fetch(`https://carbox-server-new-1.onrender.com/api/RideOrders/${rideId}/assign`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        const assignData = await assignResponse.json();

        if (!assignResponse.ok) {
          throw new Error(assignData.message || 'Failed to assign car');
        }

        console.log("Car assigned successfully:", assignData);

        // Navigate to CarboxArrived with full ride info
        navigate('/CarboxArrived', {
          state: {
            originStation,
            destinationStation,
            departureTime,
            rideOrder: { ...rideOrderToUse, ...assignData },
            userID
          }
        });
      } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : 'Unexpected error occurred';
        alert(message);
        navigate('/SearchBox', { state: { userID } });
      }
    }

    createAndAssignCar();
  }, [rideOrder, originStation, destinationStation, departureTime, userID, navigate]);

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
    }}>
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
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#0d47a1', fontWeight: 'bold' }}>
            Looking for a CARBOX..
          </Typography>
          <FadeLoader color="#0d47a1" />
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoadingPage;
