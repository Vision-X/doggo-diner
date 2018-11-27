import React, { Component } from "react";
import dotenv from "dotenv";
import { fire } from "../fire";

export default class Secret extends Component {
  state = {
    fetched: false,
    name: "",
    db: fire.database()
  };

  count = 0;

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
      .catch(error => console.log(error));
  };

  setName = name => {
    this.setState({
      name: name,
      fetched: true
    }, localStorage.setItem("name", name));
    this.checkUsr(name, this.findUsr(name));
  };

  findUsr = user => {
    let userList = this.state.db.ref("/users");
    userList.once("value").then(snap => {
      snap.forEach(babySnap => {
        if (babySnap.key == user) {
          console.log("THEY EXIST BIHHH");
          return true;
        } else {
          console.log("NO RECORDS FOUND BIHHH");
          return false;
        }
      });
    });
  };

  checkUsr = user => {
    console.log("checkUsr called");
    // this.state.db.ref("/users").set({ })
    // this.state.db.ref(`/users/${user}`).set({
    //     joined: this.dateConversion(),
    //     recent: "",
    //     signInLog: {
    //       lastLogin: Date.now(),
    //       visits: 1
    //    }
    // });
    let deebee = this.state.db;
    let reff = this.state.db.ref("/users");
    let today = this.dateConversion().replace(/\//g, "-");
    reff.once("value").then(snap => {
      snap.forEach(childSnap => {
        let name = childSnap.key;
        let logPath = `/users/${user}/signInLog`;
        if (user === name) {
          //console.log("MATCHES");
          let count = 1;
          if (childSnap.child(`signInLog/${today}`) == null) {
            deebee.ref(logPath).set(today);
            deebee
              .ref(`${logPath}/${today}`)
              .child("visits")
              .set(count);
            return true;
          } else {
            count = childSnap.child(`/signInLog/${today}/visits`).val() + 1;
            deebee
              .ref(`${logPath}/${today}`)
              .child("visits")
              .set(count);
            deebee
              .ref(`${logPath}/${today}`)
              .child("lastLogin")
              .set(Date.now());
            return true;
          }
        } else {
          //console.log("NO MATCHES!");
          deebee.ref(`/users/${user}`).set({
            joined: this.dateConversion(),
            recent: "",
            signInLog: {
              [`${today}`]: {
                lastLogin: Date.now(),
                visits: 1
              }
            }
          });
          return false;
        }
      });
    });
  };

  dateConversion = () => {
    // let date = new Date();
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    today = mm + "/" + dd + "/" + yyyy;
    return today;
  };

  getName = () => localStorage.getItem("name");

  // loadDB = () => {
  //   if (this.state.db) {
  //     this.state.db.ref().on("value", function(snapshot) {
  //       console.log(snapshot.val());
  //     })
  //   } else {
  //     console.log("waitingggg");
  //   }
  // }

  dataLoaded = () => {
    if (this.count < 100) {
      this.count++;
      console.log(this.count);
    }
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
      );
    } else {
      return (
        <>
          <p>Loading...</p>
        </>
      );
    }
  };

  componentDidMount() {
    this.fetchUsrData();
  }

  render() {
    return this.dataLoaded();
  }
}
