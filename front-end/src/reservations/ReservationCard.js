import React, {useState} from "react";
import { sendUpdate } from "../utils/api";
import generator from "../utils/generator";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
/**
 * Defines the ReservationCard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function ReservationCard({data, refresh}) {
  const {reservation_id, first_name, last_name, people} = data;
  const [status, setStatus] = useState(data.status);
  const history = useHistory();
  let btn;

  function generateBtn(){

    switch (status) {
      case generator.status.BOOKED:
        const link = `/reservations/${reservation_id}/seat`;
        btn = <p className="btn blue" onClick={()=>history.push(link)} href={link} >Seat</p>
      break;
      case generator.status.SEATED:
        btn = null;
      break;
      default:
        btn = null;
        break;
    }
  }

  async function cancelClick(){
    if(window.confirm('Do you want to cancel this reservation?')){
      try{
        const abortController = new AbortController();
        const statusValue = generator.status.CANCELED;
        const statusObj = {data: {status: statusValue}};     
        await sendUpdate(statusObj, 'reservations/'+reservation_id+'/status', abortController.signal);
        setStatus(statusValue);
        refresh();
      }catch(e){
        console.log(e)
      }
    }
  }

  
  generateBtn();

  return (
    <div className="d-inline-flex card-container">
      <div className="p-2">
        <h3> {first_name} </h3> 
        <h3> {last_name} </h3>
        <h3> People: {people} </h3> 
        <h3> Status: <span data-reservation-id-status={reservation_id}>{status}</span> </h3> 
        <div className="actions-container">
          {btn}

          <p
          className="btn green"
          onClick={()=>history.push(`/reservations/${reservation_id}/edit`)}
          href={`/reservations/${reservation_id}/edit`}
          >Edit</p>
          {
            status === generator.status.BOOKED? 
            <p 
            className="btn grey"
            onClick={cancelClick}
            data-reservation-id-cancel={reservation_id}
            > Cancel </p> : null
          }
        </div>
    
      </div>
    </div>
  );
}

export default ReservationCard;