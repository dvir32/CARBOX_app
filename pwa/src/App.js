import React from 'react';
import { useState } from 'react';
import './App.css';

function App() {
  const [status, setStatus] = useState('');

  const handleStart = () => {
    setStatus("start")
    fetch("https://..", {
      method: "POST", 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          status: "start"
        }
      )
    })
      .then((response) => response.json())
      .then((data) => {
      })
      .catch((error) => console.log(error));
  } ;

  const handleStop = () => {
    setStatus("stop")
    fetch("https://..", {
      method: "POST", 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          status: "stop"
        }
      )
    })
      .then((response) => response.json())
      .then((data) => {
      })
      .catch((error) => console.log(error));
  } ;


  return (
    <div >
    <button onClick={handleStart}>starttt</button>
    <button onClick={handleStop}>stoppp</button>
    </div>
  );
  
}

export default App;
