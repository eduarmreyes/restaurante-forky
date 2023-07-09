import React, { useState } from "react";
import { assignTable } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
/**
 * Defines the ReservationForm page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function TableForm() {
  const [table, setTable] = useState('');
  const [capacity, setCapacity] = useState('1');
  const history = useHistory();
  const [reservationsError, setReservationsError] = useState(null);

  function cancelClick(e){
    e.preventDefault();
    history.goBack();
  }

  function dataValidation(){
    if(table.length < 2){
      setReservationsError({message: "The table name must be longer than 2 characters"});
      return false
    }else if(Number.parseInt(capacity) < 1){
      setReservationsError({message: "The minimum capacity is 1"});
      return false
    }
    return true;
  }

  async function onSubmit(e){
    e.preventDefault();

    try{

      if(dataValidation()){
        const abortController = new AbortController();
        const reserveObj = {
            "table": table,
            "capacity": capacity
        }
        const response = await assignTable( reserveObj ,abortController.signal);
        if(!response){
          setReservationsError({message: "The time has to be after 10:30 AM and before 9:30 PM"});
        }else{
          history.push('/dashboard');
        }
        
      }
    }catch(e){
        setReservationsError({message: "Make sure the date is greater than today and all inputs are correct"});
        console.log(e);
    }
  }

  return (
    <div>
      <h1>Add table</h1>
      <div className="d-md-flex mb-3">
        <form onSubmit={onSubmit}>
            <label>Table name</label>
            <input name="table_name" 
                required
                onChange={(e)=>setTable(e.target.value)}
                value={table} />
            <label>Capacity</label>
            <input name="capacity" 
                required
                onChange={(e)=>setCapacity(e.target.value)}
                value={capacity} />

            <ErrorAlert error={reservationsError}/>
            
            <button type="submit">Submit</button>
            <button type="button"
              onClick={(e)=>{cancelClick(e)}}>cancel</button>
        </form>
      </div>
      
    </div>
  );
}

export default TableForm;
