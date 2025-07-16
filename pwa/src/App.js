import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#0d47a1',
    },
    secondary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1565c0',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    fontWeightBold: 700,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function App({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar 
        position="static" 
        sx={{ 
          background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)',
          boxShadow: '0 4px 20px rgba(13, 71, 161, 0.4)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 'bold', 
              letterSpacing: 2,
              color: '#ffffff',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            CARBOX App
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 50%, #bbdefb 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(25, 118, 210, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}>
        {children}
      </Box>
    </ThemeProvider>
  );
}

export default App;