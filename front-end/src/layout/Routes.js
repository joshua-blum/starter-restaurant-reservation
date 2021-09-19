import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import useQuery from '../utils/useQuery';
import CreateReservationForm from '../reservations/CreateReservationForm';
import CreateTableForm from '../tables/CreateTableForm';
import SeatForm from '../reservations/SeatForm';
import SearchReservations from "../search/searchReservations";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const date = useQuery().get("date");
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path='/reservations/new'>
        <CreateReservationForm />
      </Route>
      <Route path='/reservations/:reservation_id/seat'>
        <SeatForm />
      </Route>
      <Route exact={true} path='/reservations'>
        <Redirect to={'/dashboard'} />
      </Route>
      <Route path='/dashboard'>
        <Dashboard date={date ? date:today()} />
      </Route>
      <Route exact={true} path='/tables/new'>
        <CreateTableForm />
      </Route>
      <Route exact={true} path='/search'>
        <SearchReservations />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
