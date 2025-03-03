
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useEffect,useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import './FindingCarbox.css';
import CarboxCard from './CarboxCard';

function FindingCarbox() {


    // list of carbox from the server - and card for one carbox
  return (
    <div>
    <div id='carbox-list'>
    We found a carbox for you
    
    <CarboxCard className="grid-item" id='A1' origin='A' destination='C' departureTime='15:55' arrivalTime='16:15'/>
    </div>
    </div>
  );
  
}

export default FindingCarbox; 


