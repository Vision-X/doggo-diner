import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Auth from './Auth';
import * as serviceWorker from './serviceWorker';

const auth = new Auth();
let state = {};
window.setState = changes => {
  state = Object.assign({}, state, changes)
  ReactDOM.render(<App {...state} />,
  document.getElementById('root'))
}

let initialState = {
  name: 'Derp',
  location: window.location.pathname.replace(/^\/?|\/$/g, ""),
  auth
}

window.setState(initialState)
serviceWorker.unregister();
