import React, { Component } from "react";

export default class Secret extends Component {

  state = {
    fetched: false,
    name: ""
  }

  fetchUsrData = () => {
    let token = localStorage.getItem("access_token");
    return fetch("https://3788high.auth0.com/userinfo", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => this.setName(data.name))
      .then(this.setState({ fetched: true }))
      .catch(error => console.log(error));
  };

  setName = name => {
    this.setState({ name: name }, localStorage.setItem("name", name));
  }

  getName = () => localStorage.getItem("name");

  dataLoaded = () => {
    if (this.state.fetched && this.state.name.length) {
      return (
        <div>
          <h3>Welcome, {this.state.name}</h3>
          Secret Area
          <br />
          <a href="/">Go Home</a>
          <br />
          <button onClick={this.props.auth.logout}>Logout</button>
        </div>
      )
    } else {
      return (
        <>
          <p>Loading...</p>
        </>
      )
    }
  }

  componentDidMount() {
    this.fetchUsrData().then(this.dataLoaded())
  }

  render() {
    return (
      this.dataLoaded()
    );
  }
}
