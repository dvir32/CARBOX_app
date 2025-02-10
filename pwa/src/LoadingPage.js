
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useEffect,useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";
import './LoadingPage.css';

function LoadingPage() {
    const location = useLocation();
    const originStation = location.state.originStation;
    const destinationStation = location.state.destinationStation;
    const departureTime = location.state.departureTime;
    console.log(originStation)
    console.log(destinationStation)
    console.log(departureTime)


  return (
    
    <div>
    <div id='loading-box'>
    Looking for a CARBOX..
    <FadeLoader />
    </div>
    </div>
  );
  
}

export default LoadingPage; 


