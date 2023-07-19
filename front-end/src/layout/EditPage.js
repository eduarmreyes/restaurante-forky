import React from "react";
import ReservationForm from "../reservations/ReservationForm";
/**
 * Defines the layout of the reservation page.
 *
 *
 * @returns {JSX.Element}
 */
function EditPage() {

  return (
    <div className="container-fluid">
      <h2>Edit reservation</h2>
      <ReservationForm/>
    </div>
  );
}

export default EditPage;
