
import * as React from 'react';
import './CarboxArrived.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function CarboxArrived(props) {
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
        <CardContent>
          <Typography 
            variant="h5" 
            align="center" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              color: '#0d47a1',
              textShadow: '0 2px 4px rgba(13, 71, 161, 0.1)'
            }}
          >
            Your car has<br />arrived at the station
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
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
              Start now
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CarboxArrived; 


