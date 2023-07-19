import React, {useState} from "react";
import { listReservations } from "../utils/api";
import ReservationCard from "../reservations/ReservationCard";

/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Search() {
  const [number, setNumber] = useState('');
  const [reservation, setReservation] = useState([]);

  const search = async function(e){
    try{
      e.preventDefault();
      const abortController = new AbortController();
      const response = await listReservations({ mobile_number: number }, abortController.signal);
      setReservation(response);
    }catch(er){
      console.log(er)
    }

  }


  return (
    <div className="container-fluid">
        <form onSubmit={search}>
          <label>Mobile</label>
            <input name="mobile_number"
              placeholder="Enter a customer's phone number"
              onChange={(e)=>setNumber(e.target.value)}
              value={number} />
          <button className="btn blue" type="submit">Find</button>
        </form>

        {
        reservation.length > 0?
        (reservation.map( (item)=> <ReservationCard key={item.reservation_id} data={item}/>)
         ): <p>No reservations found</p>
      }

    </div>
  );
}

export default Search;
