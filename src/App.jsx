import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import MenuAp from './components/menu';
import './styles/App.css';
import LineOneNoLimit from "./screens/line_one_nolimit";
import LineOneLimit from "./screens/line_one_limit";
import Home from "./screens/home.js";

function App() {
  return (
    <Router>
      <div className="body">
        <MenuAp />
        <div className="mainContainer">
          <Switch>
            <Route path="/line_one_nolimit">
              <LineOneNoLimit />
            </Route>
            <Route path="/line_one_limit">
              <LineOneLimit />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
