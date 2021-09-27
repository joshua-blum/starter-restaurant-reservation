import React, { useState } from "react";
import ReservationList from "../reservations/ReservationList";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

import "../colors.css";

/**
 * Defines a search page for reservations to search by mobile_number parameter
 * @returns {JSX.element}
 */
export default function SearchReservations() {
  const initialFormData = { mobile_number: "" };
  const initialReservationSearchMessage =
    "Use the mobile phone of the reservation";

  //defines local state function for reservations relevant to present search query
  const [reservations, setReservations] = useState([
    initialReservationSearchMessage,
  ]);
  const [mobilePhone, setMobilePhone] = useState({ ...initialFormData });
  const [reservationsError, setReservationsError] = useState(null);

  const handleChange = (event) => {
    event.preventDefault();
    setMobilePhone({ ...mobilePhone, mobile_number: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    setReservationsError(null);
    if (mobilePhone.mobile_number.length > 0) {
      listReservations(mobilePhone, abortController.signal)
        .then(setReservations)
        .catch(setReservationsError);
    } else setReservations([initialReservationSearchMessage]);
    return () => abortController.abort();
  };

  //defines the reservations displayed on the search page depending on user queries
  const searchHTML = (reservations) => {
    if (typeof reservations[0] === "object")
      return <ReservationList reservations={reservations} />;
    else if (typeof reservations[0] === "string")
      return <h5 className="goldenrod p-5">{reservations[0]}</h5>;
    else return <h4 className="goldenrod p-5">No reservations found</h4>;
  };

  return (
    <>
      <div className="violet p-4 m-0">
        <h1 className="oi oi-magnifying-glass"> Search for a Reservation</h1>
      </div>
      <ErrorAlert error={reservationsError} />
      <form className="m-4" onSubmit={handleSubmit}>
        <div className="form-group m-0">
          <label htmlFor="mobile_number">Phone number:</label>
          <input
            id="mobile_number"
            type="text"
            className="form-control m-2 p-4"
            name="mobile_number"
            value={mobilePhone.mobile_number}
            placeholder="Type the mobile phone of the reservation you are looking for"
            onChange={handleChange}
          />
          <br />
          <button className="btn dark-violet" value="Submit" type="submit">
            Find
          </button>
        </div>
      </form>
      <div className="m-4">{searchHTML(reservations)}</div>
    </>
  );
}
