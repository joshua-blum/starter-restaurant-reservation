import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

import "../colors.css";

/**
 * Defines a form which allows user input to create a new table in the database
 * @param {*} tableCreation - API call to POST user input data to database to make new table
 * @returns {JSX.element}
 */
export default function CreateTableForm({ tableCreation }) {
  const [error, setError] = useState(null);
  const abortController = new AbortController();
  const history = useHistory();
  const initialFormState = {
    table_name: "",
    capacity: 0,
  };

  const [formData, setFormData] = useState({ ...initialFormState });

  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await tableCreation(formData, abortController.signal);
      setFormData({ ...initialFormState });
      history.push("/dashboard");
      return () => abortController.abort();
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setFormData({ ...initialFormState });
    history.goBack();
  };

  return (
    <>
      <div className="violet p-4 m-0">
        <h1 className="oi oi-layers"> Make a Table</h1>
      </div>
      <ErrorAlert error={error} />
      <form className="m-4" onSubmit={handleSubmit}>
        <div className="form-group m-0">
          <label htmlFor="table_name">Table Name:</label>
          <input
            id="table_name"
            type="text"
            className="form-control"
            name="table_name"
            placeholder="Table Name"
            onChange={handleChange}
            value={formData.table_name}
          />
        </div>
        <div className="form-group m-0">
          <label htmlFor="capacity">Capacity:</label>
          <input
            id="capacity"
            type="number"
            className="form-control"
            name="capacity"
            onChange={handleChange}
            value={formData.capacity}
          />
        </div>
        <br />
        <div className="d-flex justify-content-between">
          <button
            type="submit"
            className="btn dark-violet"
            onSubmit={handleSubmit}
          >
            Submit
          </button>
          <button
            type="button"
            className="btn light-silver"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
      <br />
    </>
  );
}
