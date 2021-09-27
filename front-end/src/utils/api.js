/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);
    if (
      response.status === 204 ||
      (response.status === 200 && options.method === "DELETE")
    ) {
      return null;
    }
    const payload = await response.json();
    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves reservations based on passed params.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservations saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Retrieves all existing tables.
 * @returns {Promise<[tables]>}
 *  a promise that resolves to a possibly empty array of tables saved in the database.
 */
export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { headers, signal }, []);
}

/**
 * Retrieves a reservation with reservation_id matching passed id
 * @param {*} id - reservation_id to be found in database
 * @param {*} signal - (optional) signal to communicate with or abort a DOM request
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array with reservation matching passed
 *  id from the database
 */
export async function findReservation(id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${id}`);
  return await fetchJson(url, { headers, signal }, []);
}

/**
 * Creates a new reservation object in the database
 * @param {*} reservation - reservation data passed in by user to be stored in database
 * @param {*} signal - (optional) signal to communicate with or abort a DOM request
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array with the user-created reservation
 *  stored in the database
 */
export async function createReservation(reservation, signal) {
  const url = `${API_BASE_URL}/reservations`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  };
  return await fetchJson(url, options, "createReservation error");
}

/**
 * Creates a new table object in the database
 * @param {*} table - table data passed in by user to be stored in database
 * @param {*} signal - (optional) signal to communicate with or abort a DOM request
 * @returns {Promise<[table]>}
 *  a promise that resolves to a possibly empty array with the user-created table
 *  stored in the database
 */
export async function createTable(table, signal) {
  const url = `${API_BASE_URL}/tables`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: table }),
    signal,
  };
  return await fetchJson(url, options, "createTable error");
}

/**
 * Assigns a reservation_id to a table
 * @param {*} id - reservation_id to be updated into the relevant table
 * @param {*} table_id - table_id of the table being updated with a reservation
 * @param {*} signal - (optional) signal to communicate with or abort a DOM request
 * @returns {Promise<[table]>}
 *   a promise that resolves to a possibly empty array with the updated table
 *   stored in the database
 */
export async function assignReservation(id, table_id, signal) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { reservation_id: id } }),
    signal,
  };
  return await fetchJson(url, options, "assignReservation error");
}

/**
 * Removes a reservation_id from a table
 * @param {*} table_id - table_id of the table having its reservation removed
 * @param {*} signal - (optional) signal to communicate with or abort a DOM request
 * @returns {Promise}
 *  a promise with a status code reflective of a successful deletion, or error
 */
export async function unassignReservation(table_id, signal) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "DELETE",
    headers,
    signal,
  };
  return await fetchJson(url, options, "unassignReservation error");
}

/**
 * Updates a reservation with a passed in status
 * @param {*} id - reservation_id of the reservation to be updated
 * @param {*} newStatus - value of status to be updated to reservation
 * @param {*} signal - (optional) signal to communicate with or abort a DOM request
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array with the updated reservation
 *  stored in the database
 */
export async function updateReservationStatus(id, newStatus, signal) {
  const url = `${API_BASE_URL}/reservations/${id}/status`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { status: newStatus } }),
    signal,
  };
  return await fetchJson(url, options, "update reservation status error");
}

/**
 * Updates a reservation based on user input
 * @param {*} updatedReservation - reservation data with user edits
 * @param {*} id - reservation_id of the reservation to be updated
 * @param {*} signal - (optional) signal to communicate with or abort a DOM request
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array with the updated reservation
 *  stored in the database
 */
export async function editReservation(updatedReservation, id, signal) {
  const url = `${API_BASE_URL}/reservations/${id}`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: updatedReservation }),
    signal,
  };
  return await fetchJson(url, options, "editReservation error");
}
