import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "../history";

// Components
import Login from "./Login";
import Home from "./Home";
import Account from "./Account";
import GeneralError from "./error/GeneralError";
import PageNotFoundError from "./error/PageNotFoundError";

// Style Sheets
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <>
      <Router history={history}>
        <div>
          <Switch>
            <Route path="/login" exact component={Login} />
            <Route path="/home" exact component={Home} />
            <Route path="/account" exact component={Account} />
            {/* <Route path="/buy/:id" exact component={} />
            <Route path="/search" exact component={} />
            <Route path="/sell" exact component={} />
            <Route path="/purchase-history" exact component={} />
            <Route path="/purchase-success" exact component={} />
            <Route path="/purchase-failure" exact component={} />
            <Route path="/reverse-image-search" exact component={} /> */}
            <Route path="/error" exact component={GeneralError} />
            <Route component={PageNotFoundError} />
          </Switch>
        </div>
      </Router>
    </>
  );
};

export default App;
