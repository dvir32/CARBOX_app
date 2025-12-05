import * as React from 'react';
import {Html5QrcodeScanner} from "html5-qrcode"
import { useState } from 'react';
import { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function QRScanner() {
  const [scannerResult, setScannerResult] = useState(null);

   useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox:{
        width:250,
        height:250,
      },
      fps: 5,
    })
    scanner.render(success, error)
  
    function success(result){
      scanner.clear();
      setScannerResult(result)
    }
  
    function error(err){
      console.warn(err)
    }
   },[])

   useEffect(() => {
    if (scannerResult != null){
      fetch("https://localhost:7158/api/scanner", { // cange to the correct api
        method: "POST", 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            Carbox: scannerResult  
          })})
      .then((response) => {
          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }
          
          return response.json();
        })
        .then((data) => {
          console.log("Status updated:", data);
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    }
    
   },[scannerResult])

  

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
            QR Scanner
          </Typography>
          {scannerResult
            ? <Typography sx={{ color: '#0d47a1' }}>success: <a href={'http://' + scannerResult} style={{ color: '#0d47a1', textDecoration: 'underline' }}>{scannerResult}</a></Typography>
            : <div id="reader"></div>
          }
        </CardContent>
      </Card>
    </Box>
  );
  
}

export default QRScanner; 


