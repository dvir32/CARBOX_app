import React from 'react';
import { Box, Button, Typography, Card, CardContent, Container } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

function Home() {
  return (
    <Box
      sx={{
        minHeight: '80vh',
        background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ 
          p: 4, 
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
          <CardContent>
            <Typography 
              variant="h3" 
              align="center" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: '#0d47a1',
                textShadow: '0 2px 4px rgba(13, 71, 161, 0.1)',
                mb: 3
              }}
            >
              Welcome to CARBOX!
            </Typography>
            <Typography 
              variant="body1" 
              align="center" 
              color="text.secondary" 
              gutterBottom
              sx={{ fontSize: '1.1rem', mb: 4, color: '#616161' }}
            >
              Find, book, and ride with ease. Start your journey now.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<DirectionsCarIcon />}
                href="#/SearchBox"
                sx={{
                  background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
                  color: '#fff',
                  borderRadius: 3,
                  boxShadow: '0 8px 25px rgba(13, 71, 161, 0.4)',
                  px: 4,
                  py: 2,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0a3d8f 0%, #0d47a1 100%)',
                    boxShadow: '0 12px 35px rgba(13, 71, 161, 0.5)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Find a Ride
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Home; 