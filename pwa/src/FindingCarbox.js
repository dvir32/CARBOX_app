import React, { useEffect, useState } from 'react';
import './FindingCarbox.css';
import CarboxCard from './CarboxCard';
import { useLocation } from "react-router-dom";
import axios from 'axios';

function FindingCarbox() {
  const location = useLocation();
  const rideOrder = location.state?.rideOrder?.result || location.state?.rideOrder;
  const [ride, setRide] = useState(null);
  const [error, setError] = useState(null);
  const [arrival, setArrivalTime] = useState(null);

  useEffect(() => {
    console.log("useEffect ran", rideOrder);

    async function assignCar() {
      console.log("rideOrder.ride.id ", rideOrder.ride.id);
      try {
        const response = await axios.post(`http://localhost:5269/api/RideOrders/${rideOrder.ride.id}/assign`);
        console.log(response);
        setRide(response.data.ride);
        setArrivalTime(response.data.arrival);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      }
    }

    if (rideOrder?.ride) {
      assignCar();
    } else {
      console.log("rideOrder is missing or id is undefined");
    }
  }, [rideOrder]);



  if (error) return <div>Error: {error}</div>;
  if (!ride) return <div>Looking for a carbox...</div>;

  return (
      <div>
        <div id='carbox-list'>
          We found a carbox for you
          <CarboxCard
              className="grid-item"
              id={ride.assignedCarId}
              origin={ride.source.name}
              destination={ride.destination.name}
              departureTime={ride.rideTime}
              arrivalTime={arrival} // You might calculate or fetch this later
          />
        </div>
      </div>
  );
}

export default FindingCarbox;
