
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
      name:"Dealer One",
      position:[-122.33, 47.6],
      address:"123 Main St, City, State",
    },
    {
      id:2,
      name:"Dealer Two",
      position:[-122.4, 47.55],
      address: "456 Elm St, City, State",
    }
  ] 


  return (
        <div className='flex h-screen'>
        <div>
        {dealers.map((dealer)=>(
          <div key={dealer.id}>
          <h2>{dealer.name}</h2>
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


