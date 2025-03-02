
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useEffect,useState } from 'react';
import { useNavigate } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";
import './SearchBox.css';
import AzureMap from './AzureMap';

function Map(props) {
  
  const mapLocation = { lat: 32.0853, lng: 34.7818 }; // Default to Tel Aviv
  const stations = props.stations
  const dealers = [
    {
      id:1,
      name:"A",
      position:[34.845928738696166, 32.07267127439871],
      address:"Bar Ilan University1",
    },
    {
      id:2,
      name:"B",
      position:[34.84643333333333, 32.071666666666665],
      address: "Bar Ilan University2",
    },
    {
      id:3,
      name:"C",
      position:[34.843532270029975, 32.07037406971176],
      address: "Bar Ilan University3",
    },
    {
      id:4,
      name:"D",
      position:[34.84494516698849, 32.07002301889414],
      address: "Bar Ilan University4",
    }
  ] 


  return (
        <div className='flex h-screen'>
        <div>
        <AzureMap subscriptionKey={'BYG1g5auep5jrbjPOjn34Btd5vK9Yet9YsZEcHWm3yuMNammODmqJQQJ99BBACYeBjF5VmYeAAAgAZMP1IvB'} stations={stations}/>
        </div>
        </div>         
        );
  
}

export default Map; 


