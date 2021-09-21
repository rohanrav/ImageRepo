import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "../history";

// Components
import Login from "./Login";
import Home from "./Home";
import Account from "./Account";
import Sell from "./Sell";
import Buy from "./Buy";
import Feed from "./Feed";
import Search from "./Search";
import GeneralError from "./error/GeneralError";
import PageNotFoundError from "./error/PageNotFoundError";
import PrivacyPolicy from "./PrivacyPolicy";

// Style Sheets
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <Router history={history}>
      <div>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/home" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/account" exact component={Account} />
          <Route path="/sell" exact component={Sell} />
          <Route path="/buy/:id" exact component={Buy} />
          <Route path="/feed" exact component={Feed} />
          <Route path="/search" exact component={Search} />
          <Route path="/privacy-policy" exact component={PrivacyPolicy} />
          <Route path="/error" exact component={GeneralError} />
          <Route component={PageNotFoundError} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
