import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { RangeFixed } from "./pages/Exercise2";
import { RangeMinMax } from "./pages/Exercise1";
import { Home } from "./pages/Home";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/exercise1">
            <nav>
              <Link to="/"><p>Home</p></Link>
            </nav>
            <RangeMinMax />
          </Route>
          <Route path="/exercise2">
            <nav>
              <Link to="/"><p>Home</p></Link>
            </nav>
            <RangeFixed />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
