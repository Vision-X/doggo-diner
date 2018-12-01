import React, { Component } from "react";
import dotenv from "dotenv";
import { fire } from "../fire";

export default class Secret extends Component {
  constructor() {
    super();
    this.state = {
      fetched: false,
      name: "",
      db: fire.database(),
      data: {}
    };
    // this.fetchUsrData();
    // this.fetchDB();
  }

  count = 0;

  fetchDB = () => {
    console.log("fetchDB");
    let token = localStorage.getItem("access_token");
    return fetch("https://3788high.auth0.com/userinfo", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => res.json())
      .then(data => {
        console.log("data.name ", data.name);
        this.saveName(data.name);
        return data.name
      })
      .then((nom) => this.saveDBCopy(nom))
      .catch()
  };

    // let derpy = new Promise((resolve, reject) => {
    //   if (this.validUsr(user)) resolve(true)
    //   else resolve(true)
    // })
    // derpy.then((value) => console.log(value))

  saveDBCopy = user => {
    console.log("saveDBCopy");
    console.log("user ", user);
    // let user = this.state.name;
    let snoog;
    let userList = this.state.db.ref("/users");
    userList.once("value").then(snap => {
      snoog = snap.exportVal();
      this.setState({
        data: snoog,
        name: user,
        fetched: true
      })
    }).then(() => this.lawgState())
      .then(() => {
        // CHECK IF USER EXISTS
        if (this.userExists()) {
          // IF USER EXISTS BUT TODAY DOESNOT EXIST, CREATDAY, ELSE UPDATEDAY
          if (!this.todayExists()) {
            this.createDay();
            this.updateVisits();
          } else {
            this.updateVisits();
            this.updateLoginTime();
            //
          }
        } else {
          // USER DOESNT EXIST, CREATE THEM, THEN REFETCH
          this.createUser();
          this.fetchDB();
        }
      })
    //check userExists
    return true;
  };

  fetchDBthenState = new Promise((resolve, reject) => {
    if (this.state && this.state.data && Object.keys(this.state.data).length > 1) {
      console.log("we have state data!!!");
      resolve(true);
    } else {
      // resolve(false)
    }
  });

  saveName = user => this.setState({ name: user }, this.logName());

  logName = () => console.log(this.state.name);

  lawgState = () => console.log("lawgState...", this.state);

  userExists = () => {
    console.log("userExists fn ____________");
    let user = this.state.name;
    if (this.state.data && Object.keys(this.state.data).length > 1) {
      let ayy = Object.keys(this.state.data);
      if (this.state.data.hasOwnProperty(user)) {
          console.log("User Exists");
          return true;
      } else {
          console.log("User Doesnt Exist");
          return false;
        }
    }
  };

  createUser = () => {
    console.log("createUser_____________");
    let user = this.state.name;
    let today = this.dateConversion();
    this.state.db.ref(`/users/${user}`).set({
      joined: this.timeStamp(),
      recent: "",
      signInLog: {
        [`${today}`]: {
          lastLogin: this.timeStamp(),
          visits: 0
        }
      }
    });
  };

  createDay = () => {
    console.log("createDay fn _____________");
    let today = this.dateConversion();
    let user = this.state.name;
    this.state.db.ref(`/users/${user}/signInLog`).update({
      [`${today}`]: {
        lastLogin: this.timeStamp(),
        visits: 1
      }
    });
  };


  // updateUser = () => {
  //   this.updateLoginTime();
  //   this.updateDBCopy()
  // };

  updateVisits = () => {
    console.log("updateVisits____________");
    let deebo = this.state.db;
    let user = this.state.name;
    let day = this.dateConversion();
    let count = this.state.data[`${user}`].signInLog[`${day}`].visits || 0;
    count++;
    return deebo
          .ref(`/users/${user}/signInLog/${day}`)
          .child("visits")
          .set(count);
  }

  updateLoginTime = () => {
    console.log("updateLoginTime_____________");
    let db = this.state.db;
    let user = this.state.name;
    let day = this.dateConversion();
    return db
          .ref(`/users/${user}/signInLog/${day}`)
          .child("lastLogin")
          .set(this.timeStamp());
  }

  todayExists = () => {
    console.log("todayExists_____________");
    let deebs = this.state.data;
    let user = this.state.name;
    let today = this.dateConversion();
    if (deebs[user]["signInLog"].hasOwnProperty(today)) {
          console.log("today exists");
          return true;
    } else {
      console.log("today doesnt exist");
      return false;
    }
  };

  updateDBCopy = () => { this.fetchDB() };

  timeStamp = () => {
    return new Date().toLocaleString('en-US', { timeZone: 'America/Denver' })
  }

  dateConversion = () => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    today = mm + "-" + dd + "-" + yyyy;
    return today;
  };

  dataLoaded = () => {
    if (this.count < 100) {
      this.count++;
      console.log(this.count);
    }
    if (this.state.fetched && this.state.name) {
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


///////////////////////////////
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\//
//////////////////////////////

  fetchUsrData = () => {
    let token = localStorage.getItem("access_token");
    return fetch("https://3788high.auth0.com/userinfo", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => this.saveDBToState(data.name))
      .catch(error => console.log(error));
  };

  componentDidMount() {
    this.fetchDB();
  }

  render() {
    return this.dataLoaded();
  }
}
