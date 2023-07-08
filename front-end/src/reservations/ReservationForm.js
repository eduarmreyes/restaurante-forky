import React, { useState } from "react";
import { insertReservation } from "../utils/api";
import { useHistory } from "react-router-dom";

/**
 * Defines the ReservationForm page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function ReservationForm() {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [reserveDate, setReserveDate] = useState('');
  const [reserveTime, setReserveTime] = useState('');
  const [people, setPeople] = useState('');
  const history = useHistory();
//   const [reservationsError, setReservationsError] = useState(null);

  async function onSubmit(e){
    e.preventDefault();

    try{
        const abortController = new AbortController();
        // setReservationsError(null);
        const reserveObj = {
            "first_name": name,
            "last_name": lastName,
            "mobile_number":mobileNumber,
            "reservation_date":reserveDate,
            "reservation_time":reserveTime,
            people
        }
        const response = await insertReservation( reserveObj ,abortController.signal);
        //Creating abort controller
        history.push('/dashboard')
        // abortController.abort();
        // listReservations({ date }, abortController.signal)
        // .then(setReservations)
        // .catch(setReservationsError);
        // return () => abortController.abort();
    }catch(e){
        // setReservationsError(true);
        console.log(e);
    }
    console.log('submitted')
    return
  }

  return (
    <div>
      <h1>Form</h1>
      <div className="d-md-flex mb-3">
        <form onSubmit={onSubmit}>
            <label>First name</label>
            <input name="first_name" 
                required
                onChange={(e)=>setName(e.target.value)}
                value={name} />
            <label>last name</label>
            <input name="last_name" 
                required
                onChange={(e)=>setLastName(e.target.value)}
                value={lastName} />
             <label>Mobile Number</label>
            <input name="mobile_number" 
                type="tel"
                required
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                onChange={(e)=>setMobileNumber(e.target.value)}
                value={mobileNumber} />
            <label>Reservation Date</label>
            <input name="reservation_date" 
                type="date" 
                placeholder="YYYY-MM-DD" 
                pattern="\d{4}-\d{2}-\d{2}"
                onChange={(e)=>setReserveDate(e.target.value)}
                value={reserveDate} />
            <label>Time</label>
            <input name="reservation_time" 
                type="time" 
                placeholder="HH:MM" 
                pattern="[0-9]{2}:[0-9]{2}"
                onChange={(e)=>setReserveTime(e.target.value)}
                value={reserveTime} />
            <label>People</label>
            <input name="people" 
                required
                onChange={(e)=>setPeople(e.target.value)}
                value={people} /> 

            <button type="submit">Submit</button>
        </form>
      </div>
      
    </div>
  );
}

export default ReservationForm;
