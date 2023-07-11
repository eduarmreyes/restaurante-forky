import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationCard from "../reservations/ReservationCard";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(()=>{
    async function loadDashboard() {
      const abortController = new AbortController();
      try{
        setReservationsError(null);
        const response = await listReservations({ date }, abortController.signal);
        setReservations(response);

        const tableResponse = await listTables(abortController.signal);
        setTables(tableResponse);
      }catch(e){
        setReservationsError({error: "Couldn't load the records"});
      }
      
      return () => abortController.abort();
    }

    loadDashboard();
  }, [date]);

  

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>

      <ErrorAlert error={reservationsError} />
      {
        reservations.map( (item)=> <ReservationCard key={item.reservation_id} data={item}/> )
      }

      <h1>Tables</h1>
      <div className="d-md-flex mb-3">
      {
        tables.map( (item)=><div key={item.table_id} > <p>{item.table_name}</p> <div>{item.reservation? "Free": "occupied"}</div> </div>)
      }
      </div>
    </main>
  );
}

export default Dashboard;
