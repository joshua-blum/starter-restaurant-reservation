import React from "react";

import { Link } from "react-router-dom";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

import './Menu.css';

function Menu() {
  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-dark align-items-start">
      <div className="container-fluid d-flex flex-row justify-content-between">
        <Link to="/">
            <span className="navbar-brand d-flex">Periodic Tables</span>
        </Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
        <ul className="nav navbar-nav text-light flex-column flex-sm-row" id="accordionSidebar">
          <li className="nav-item p-2">
            <Link className='link' to="/dashboard">
              <span className="flex-sm-fill text-sm-center nav-link oi oi-dashboard" aria-current='page' />
              &nbsp;Dashboard
            </Link>
          </li>
          <li className="nav-item p-2">
            <Link className='link' to="/search">
              <span className="flex-sm-fill text-sm-center nav-link disabled oi oi-magnifying-glass" />
              &nbsp;Search
            </Link>
          </li>
          <li className="nav-item p-2">
            <Link className='link' to="/reservations/new">
              <span className="flex-sm-fill text-sm-center nav-link oi oi-plus" />
              &nbsp;New Reservation
            </Link>
          </li>
          <li className="nav-item p-2">
            <Link className='link' to="/tables/new">
              <span className="flex-sm-fill text-sm-center nav-link oi oi-layers" />
              &nbsp;New Table
            </Link>
          </li>
        </ul>
        </div>
      </div>
    </nav>
  </>
  );
}

export default Menu;
