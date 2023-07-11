import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

/**
 * Defines the ReservationCard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function ReservationCard({data}) {
  const {reservation_id, first_name, last_name, people} = data;
  const history = useHistory();

  function seat(id){
    console.log("clicked bby");
    history.push(`/reservations/${id}/seat`);
  }

  return (
    <div>
        <h1>ID: {reservation_id}</h1>
      <h3> {first_name} </h3> 
      <h3> {last_name} </h3>
      <h3> People: {people} </h3> 
    <button onClick={()=>seat(reservation_id)} href={`/reservations/${reservation_id}/seat`} >Seat</button>
    </div>
  );
}

export default ReservationCard;