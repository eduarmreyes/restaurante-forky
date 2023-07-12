import React from "react";

/**
 * Defines a populated select of tables.
 * @returns {JSX.Element}
 */
function TableSelect({items, table, setTable}) {

  return (
    <div>
        <select value={table} name="table_id" onChange={(e)=>{return (setTable(e.target.value))}}> 
          <option>Select table...</option>
            {
                items.map( (item)=> <option key={item.table_id} value={item.table_id}>{item.table_name} - {item.capacity}</option> )
            }
        </select>
    </div>
  );
}

export default TableSelect;