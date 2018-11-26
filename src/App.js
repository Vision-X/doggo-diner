import React, { Component } from 'react';
import './App.css';
import Main from './AuthComponents/Main';
import Secret from './AuthComponents/Secret';
import NotFound from './AuthComponents/NotFound';
import Callback from './AuthComponents/Callback';

class App extends Component {
  render() {
    let mainComponent = "";
    switch(this.props.location) {
      case "":
        mainComponent = <Main {...this.props} />;
        break;
      case "callback":
        mainComponent = <Callback />;
        break;
      case "secret":
        mainComponent = this.props.auth.isAuthenticated() ?
                                        <Secret {...this.props} /> :
                                        <NotFound />
        break;
      default:
        mainComponent = <NotFound />;
    }
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">React Applications w/ Auth0 security</h1>
        </header>
        {mainComponent}
      </div>
    );
  }
}

export default App;
