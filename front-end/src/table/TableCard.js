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
        const response = await destroy(`tables/${id}/seat`,abortController.signal);

        if(response.status === 400){
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
    <div className="flex card-container table-container">
        <h4>Name: {table_name}</h4>
        {
          reservation? 
            <div className="actions-container">
              <p data-table-id-status={table_id}>occupied</p>
              <button className="btn green" data-table-id-finish={table_id} onClick={()=>onClick(table_id)}>Finish</button>
            </div>
            : <div data-table-id-status={table_id}>Free </div>
        }
    </div>
  );
}

export default TableCard;