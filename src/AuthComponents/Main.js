import React, { Component } from 'react';
import '../App.css';

export default class Main extends Component {
  render() {
    return (
      <div>
        <p>
        Hello, {this.props.name} <br/>
        Enter? <a href="/secret">Sign In to Enter this area</a>
        </p>

      {!this.props.auth.isAuthenticated() &&
        <div>
          <hr/>
          Please login first
          <hr/>
          <button onClick={this.props.auth.login}>LOGIN</button>
        </div>
      }
      </div>
    )
  }
}
