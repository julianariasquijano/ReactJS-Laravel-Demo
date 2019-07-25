import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import './index.css';
import Admin from './Admin';
import Booking from './Booking';
import * as serviceWorker from './serviceWorker';

window.debugVar =''

const routing = (
    <Router>
      <div>
        <Route exact path="/admin" component={Admin} />
        <Route path="/booking" component={Booking} />
      </div>
    </Router>
  )

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();