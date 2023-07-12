import React, {useState} from "react";
import { sendUpdate } from "../utils/api";
import generator from "../utils/generator";
/**
 * Defines the ReservationCard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function ReservationCard({data}) {
  const {reservation_id, first_name, last_name, people} = data;
  const [status, setStatus] = useState(data.status);
  let btn;

  function generateBtn(){

    switch (status) {
      case generator.status.BOOKED:
        btn = <button onClick={()=>seat()} href={`/reservations/${reservation_id}/seat`} >Seat</button>
      break;
      case generator.status.SEATED:
        btn = null;
      break;
      default:
        btn = null;
        break;
    }
  }
  async function seat(){
    try{
      const abortController = new AbortController();
      const statusValue = generator.changeStatus(status);
      const statusObj = {data: {status: statusValue}};
      setStatus(statusValue);
      await sendUpdate(statusObj, 'reservations/'+reservation_id+'/status', abortController.signal);
      
    }catch(e){
      console.log(e);
    }
    
  }

  
  generateBtn();

  return (
    <div>
        <h1>ID: {reservation_id}</h1>
      <h3> {first_name} </h3> 
      <h3> {last_name} </h3>
      <h3> People: {people} </h3> 
      <h3> Status: <span data-reservation-id-status={reservation_id}>{status}</span> </h3> 
      {btn}
    </div>
  );
}

export default ReservationCard;