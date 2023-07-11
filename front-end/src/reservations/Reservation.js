import React, { useEffect, useState } from "react";
import { listTables, getReservation, sendUpdate } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import TableSelect from "../table/TableSelect";
import {useParams, useHistory} from "react-router-dom";
/**
 * Defines the Reservation page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Reservation() {
  const [tables, setTables] = useState([]);//array of tables
  const [requestError, setrequestError] = useState(null);
  const [table, setTable] = useState('');//table selected
  const [reservation, setReservation] = useState('');
  const {reservation_id} = useParams();//Id from params
  const history = useHistory();

  useEffect(()=>{
    async function loadTables() {
      const abortController = new AbortController();
      try{
        const response = await getReservation({reservation_id}, abortController.signal);
        setReservation(response)
        const tableResponse = await listTables(abortController.signal);
        setTables(tableResponse);
      }catch(e){
        setrequestError({error: "Couldn't load the records"});
      }
      
      return () => abortController.abort();
    }

    loadTables();
  }, [reservation_id]);

  async function onSubmit(e){
    e.preventDefault();
    try{
        const abortController = new AbortController();
        const data = {reservation_id: reservation.reservation_id, people: reservation.people};
        const response = await sendUpdate({data: data}, `tables/${table}/seat`,abortController.signal);
        
        if(response.status == 400){
            const msg = await response.json();
            setrequestError({error: msg.error});
        }else{
            history.push('/dashboard');
        }
        
    }catch(e){
        console.log(e);
    }
  }

  return (
    <main>
      <h1> Reservation: {reservation.first_name} - {reservation.last_name} </h1>
      <div className="d-md-flex mb-3">
        <p className="mb-0">People: {reservation.people}</p>
      </div>
      <h4 className="mb-0">Select a table</h4>
    <form onSubmit={onSubmit}>
      <TableSelect items={tables} table={table} setTable={setTable} />
      <ErrorAlert error={requestError} />
      <button type="submit">Assign to table</button>
    </form>
      
    </main>
  );
}

export default Reservation;
