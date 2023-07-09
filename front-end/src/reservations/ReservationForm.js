import React, { useState } from "react";
import { insertReservation } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
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
  const [reservationsError, setReservationsError] = useState(null);

  function cancelClick(e){
    e.preventDefault();
    history.goBack();
  }

  function dateValidation(){
    const receivedDate = new Date(reserveDate);
    const todayDate = new Date();

    if(receivedDate < todayDate || receivedDate.getDay() == 1){
      setReservationsError({message: "Make sure the date is greater than today and all inputs are correct"})
      return false
    }

    return true;
  }

  async function onSubmit(e){
    e.preventDefault();

    try{
      if(dateValidation()){
        const abortController = new AbortController();
        const reserveObj = {
            "first_name": name,
            "last_name": lastName,
            "mobile_number":mobileNumber,
            "reservation_date":reserveDate,
            "reservation_time":reserveTime,
            people
        }
        await insertReservation( reserveObj ,abortController.signal);
        history.push('/dashboard');
      }
        
        // abortController.abort();
        // listReservations({ date }, abortController.signal)
        // .then(setReservations)
        // .catch(setReservationsError);
        // return () => abortController.abort();
    }catch(e){
        setReservationsError({message: "Make sure the date is greater than today and all inputs are correct"});
        console.log(e);
    }
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

            <ErrorAlert error={reservationsError}/>
            
            <button type="submit">Submit</button>
            <button type="button"
              onClick={(e)=>{cancelClick(e)}}>cancel</button>
        </form>
      </div>
      
    </div>
  );
}

export default ReservationForm;
