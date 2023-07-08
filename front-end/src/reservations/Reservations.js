import React, { useEffect, useState } from "react";
import ReservationForm from "./ReservationForm";

/**
 * Defines the Reservations page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Reservations() {
    const [name, setName] = useState('');

  function handleChange(event) {
    console.log(event.target.value);
    setName(event.target.value);
  }
//   const [reservations, setReservations] = useState([]);
//   const [reservationsError, setReservationsError] = useState(null);

  

  return (
    <div>
      <h1>Reservations</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      {/* <form onSubmit={onSubmit}>
            <input name="first_name" 
                onChange={handleChange}
                value={name} />
        </form> */}
      <ReservationForm/>
      {/* <ErrorAlert error={reservationsError} /> */}
      
    </div>
  );
}

export default Reservations;
