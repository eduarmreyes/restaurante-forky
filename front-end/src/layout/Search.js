import React, {useState} from "react";

/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Search() {
  const [number, setNumber] = useState('');

  return (
    <div className="container-fluid">
      <div className="col">
      <label>Mobile</label>
        <input name="mobile_number"
           onChange={(e)=>setNumber(e.target.value)}
           value={number} />
      </div>
    </div>
  );
}

export default Search;
