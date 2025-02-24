
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useEffect,useState } from 'react';
import { useNavigate } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";
import './SearchBox.css';
import AzureMap from './AzureMap';

function Map() {
  
  const mapLocation = { lat: 32.0853, lng: 34.7818 }; // Default to Tel Aviv
  const dealers = [
    {
      id:1,
      name:"A",
      position:[34.7818, 32.0853],
      address:"Tel Aviv",
    },
    {
      id:2,
      name:"B",
      position:[34.84643333333333, 32.071666666666665],
      address: "Bar Ilan University",
    }
  ] 


  return (
        <div className='flex h-screen'>
        <div>
        {dealers.map((dealer)=>(
          <div key={dealer.id}>
          <h2>Station {dealer.name}</h2>
          <p>{dealer.address}</p>
          </div>
        ))}
        
        </div>
        <div>
        <AzureMap subscriptionKey={'BYG1g5auep5jrbjPOjn34Btd5vK9Yet9YsZEcHWm3yuMNammODmqJQQJ99BBACYeBjF5VmYeAAAgAZMP1IvB'} dealers={dealers}/>
        </div>
        </div>         
        );
  
}

export default Map; 


