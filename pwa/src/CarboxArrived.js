
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useEffect,useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import './CarboxArrived.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import CardContent from '@mui/material/CardContent';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function CarboxArrived(props) {

  return (
    
    <div id='arrived'>
    <div id='arrived-message'>
    Your car has<br></br> 
    arrived at the station
    </div>
    <Button variant="primary">Start now</Button>
    </div>
  );
  
}

export default CarboxArrived; 


