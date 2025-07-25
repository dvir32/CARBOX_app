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
  const rideOrder = location.state?.rideOrder?.result || location.state?.rideOrder;
  const originStation = location.state?.originStation;
  const destinationStation = location.state?.destinationStation;
  const departureTime = location.state?.departureTime;
  const userID = location.state?.userID;

  useEffect(() => {
    async function createAndAssignCar() {
      let rideOrderToUse = rideOrder;
      try {
        // If rideOrder.ride is missing, create the ride order first
        if (!rideOrder?.ride) {
          const response = await fetch('https://carbox-server-new-1.onrender.com/api/RideOrders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rideOrder)
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create ride order');
          }

          rideOrderToUse = await response.json();
        }

        // Now assign the car
        const assignResponse = await fetch(`https://carbox-server-new-1.onrender.com/api/RideOrders/${rideOrderToUse.ride.id}/assign`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!assignResponse.ok) {
          const errorData = await assignResponse.json();
          throw new Error(errorData.message || 'Failed to assign car');
        }

        const assignData = await assignResponse.json();

        navigate('/FindingCarbox', {
          state: {
            originStation,
            destinationStation,
            departureTime,
            rideOrder: { ...rideOrderToUse, ...assignData }
          }
        });

      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred';
        alert(message);
        navigate('/SearchBox', { state: { userID } });
      }
    }

    createAndAssignCar();
    // eslint-disable-next-line
  }, []);

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
