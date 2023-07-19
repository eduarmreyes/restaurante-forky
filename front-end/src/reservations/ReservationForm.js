import React, { useState, useEffect } from "react";
import { insertReservation, getReservation, sendUpdate } from "../utils/api";
import { formatAsDate } from "../utils/date-time";
import { useHistory, useParams } from "react-router-dom";
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
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();
  const params = useParams();

  useEffect(()=>{
    const abortController = new AbortController();

    async function retrieveReservation(){  
      try{
        const response = await getReservation( params.reservation_id, abortController.signal);
        
        setName(response.first_name);
        setLastName(response.last_name);
        setMobileNumber(response.mobile_number);
        const date = new Date(response.reservation_date)
        setReserveDate(formatAsDate(date.toISOString()));
  
        setReserveTime(response.reservation_time);
        setPeople(response.people);

      }catch(e){
        console.log(e)
      }

      
    }
    
    if(params.reservation_id){
      retrieveReservation();
    }
    
    return ()=>abortController.abort()

  }, [params.reservation_id])

  function cancelClick(e){
    e.preventDefault();
    history.goBack();
  }

  function dateValidation(){
    const receivedDate = new Date(reserveDate);
    const todayDate = new Date();
    const errors = [];//array containing the error messages
    let valid = true;//value will be false if a validation fails

    if(receivedDate < todayDate){
      errors.push("Only future dates are accepted");
      valid = false;
    }

    if(receivedDate.getDay() === 1){
      errors.push("Cannot make reservation for Tuesdays");
      valid = false;
    }

    if(!valid){
      const message = errors.map(value=><p key={value}>{value}</p>);//concatenating error messages
      setReservationsError({message: message})
    }

    return valid;
    
  }
  function phoneValidation(){
    const regFull = new RegExp(/[0-9]{3}-[0-9]{3}-[0-9]{4}/);
    const regNumber = new RegExp(/[0-9]{3}[0-9]{3}[0-9]{4}/);
    if(regFull.test(mobileNumber)){
      return true;
    }else if(regNumber.test(mobileNumber)){
      setMobileNumber(
        mobileNumber[0]+mobileNumber[1]+mobileNumber[2]+"-"
        +mobileNumber[3]+mobileNumber[4]+mobileNumber[5]+"-"
        +mobileNumber[6]+mobileNumber[7]+mobileNumber[8]
      )
        return true;
    }else{
      setReservationsError({message: "The phone number does not meet format criteria"});
      return false;
    }
  }

  async function onSubmit(e){
    e.preventDefault();

    try{

      if(dateValidation() && phoneValidation()){
        const abortController = new AbortController();
        const reserveObj = {
            "first_name": name,
            "last_name": lastName,
            "mobile_number":mobileNumber,
            "reservation_date":reserveDate,
            "reservation_time":reserveTime,
            "people": parseInt(people)
        }
        let response;
        let msg;
        if(params.reservation_id){
          reserveObj.reservation_id = params.reservation_id;

          response = await sendUpdate({data: reserveObj}, 'reservations/'+reserveObj.reservation_id, abortController.signal);
          msg = "Something went wrong. Please try again";
        }else{
          response = await insertReservation( {data: reserveObj} ,abortController.signal);
          msg = "The time has to be after 10:30 AM and before 9:30 PM";
        }

        if(!response){
          setReservationsError({message: msg});
        }else{
          history.push(`/dashboard?date=${reserveDate}`);
        }
        
      }
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
