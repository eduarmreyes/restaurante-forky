import React from "react";
import { destroy } from "../utils/api";
/**
 * Defines the TableCard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function TableCard({data, refresh}) {
  const {table_name, table_id, reservation} = data;
  
  async function onClick(id){

    if(window.confirm('Is this table ready to seat new guests?')){
      try{
        const abortController = new AbortController();
        const response = await destroy(`reservations/${reservation}/status`,abortController.signal);

        if(response.status == 400){
          alert('There was an error')
        }else{
          refresh();
        }
      }catch(e){
        console.log(e)
      }
    }//if finish
  }

  return (
    <div>
        <h2>Name: {table_name}</h2>
        {
          reservation? 
            <div><p data-table-id-status={table_id}>occupied</p><button data-table-id-finish={table_id} onClick={()=>onClick(table_id)}>Finish</button></div>
            : <div data-table-id-status={table_id}>Free </div>
        }
    </div>
  );
}

export default TableCard;