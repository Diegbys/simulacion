import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import MenuAp from './components/menu';
import './styles/App.css';
import LineOneNoLimit from "./screens/line_one_nolimit";
import LineOneLimit from "./screens/line_one_limit";
import LineVariousNoLimit from "./screens/line_various_nolimit";
import LineVariousLimit from "./screens/line_various_limit";
import Home from "./screens/home.js";
import Simulation from "./screens/simulation/simulation";
import Results from "./screens/simulation/results";
import Form from "./screens/simulation/form";

function App() {
    return (
        <Router>
            <div className="body">
                <Switch>

                    <Route path="/simulation">
                        <Switch>
                            <Route path="/simulation/game/:lambda/:mu/:observation/:queue/:servers/:limit">
                                <Simulation />
                            </Route>
                            <Route path="/simulation/results/:lambda/:mu/:observation/:queue/:servers/:limit">
                                <Results />
                            </Route>
                            <Route path="/">
                                <Form />
                            </Route>
                        </Switch>
                    </Route>

                    <Route path="/">
                        <MenuAp />
                        <div className="mainContainer">
                            <Switch>

                                <Route path="/line_one_nolimit">
                                    <LineOneNoLimit />
                                </Route>

                                <Route path="/line_one_limit">
                                    <LineOneLimit />
                                </Route>

                                <Route path="/line_various_nolimit">
                                    <LineVariousNoLimit />
                                </Route>

                                <Route path="/line_various_limit">
                                    <LineVariousLimit />
                                </Route>

                                <Route path="/">
                                    <Home />
                                </Route>

                            </Switch>
                        </div>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
