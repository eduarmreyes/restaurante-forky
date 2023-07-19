import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import ReservationPage from "./ReservationPage";
import EditPage from "./EditPage";
import Form from "../table/Form";
import NotFound from "./NotFound";
import Reservation from "../reservations/Reservation";
import Search from "./Search";
import { today } from "../utils/date-time";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/tables/new">
        <Form />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route exact path="/search">
        <Search/>
      </Route>
      <Route exact path="/reservations/:reservation_id/seat">
        <Reservation/>
      </Route>
      <Route exact path="/reservations/new">
        <ReservationPage/>
      </Route>
      <Route exact path="/reservations/:reservation_id/edit">
        <EditPage/>
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
