/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

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

    if (response.status === 204 || response.status === 400) {
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
 * insert a new row in tables.
 * @returns {Promise<[reservation]>}
 */
export async function insertTable(table, signal) {
  const url = `${API_BASE_URL}/tables`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({data: table}),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * Inserts a reservation into the db
 * @returns {Promise<[reservation]>}
 */
export async function insertReservation(reservation, signal) {
  const url = `${API_BASE_URL}/reservations`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(reservation),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
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
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of tables saved in the database.
 */

export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { headers, signal }, [])
}


/**
 * Retrieves existing reservation.
 * @returns {Promise<reservation>}
 */

export async function getReservation(id, signal) {

  const url = `${API_BASE_URL}/reservations/${id}`;
  const options = {
    method: "GET",
    headers,
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * General insert funciton 
 * @returns {Promise<[any]>}
 */
export async function sendUpdate(body, path,signal) {
  const url = `${API_BASE_URL}/${path}`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
    signal,
  };
  return await fetch(url, options, {});
}

/**
 * General delete funciton 
 * @returns {Promise<[any]>}
 */
export async function destroy(path,signal) {
  const url = `${API_BASE_URL}/${path}`;
  const options = {
    method: "DELETE",
    headers,
    signal,
  };
  return await fetch(url, options, {});
}

/**
 * General get funciton 
 * @returns {Promise<[any]>}
 */
export async function getRequest(params, path,signal) {
  const url = new URL(`${API_BASE_URL}/${path}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetch(url, {headers, signal})
}