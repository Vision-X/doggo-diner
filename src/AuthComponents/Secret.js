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
  };

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
    let fetchedDB;
    let userList = this.state.db.ref("/users");
    userList.once("value").then(snap => {
      fetchedDB = snap.exportVal();
      this.setState({
        data: fetchedDB,
        fetched: true
      })
    }).then(() => this.lawgState())
      .then(() => {
        if (this.userExists()) {
          if (!this.todayExists()) {
            this.createDay();
            this.updateVisits();
          } else {
            this.updateVisits();
            this.updateLoginTime();
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
      reject(false);
    }
  });

  saveName = user => this.setState({ name: user }, this.logName());

  logName = () => console.log("logName... ", this.state.name);

  lawgState = () => console.log("lawgState... ", this.state);

  userExists = () => {
    console.log("userExists fn ____________");
    let user = this.state.name;
    if (this.state.data && Object.keys(this.state.data).length > 1 && user !== undefined) {
      let ayy = Object.keys(this.state.data);
      return (this.state.data.hasOwnProperty(user)) ? true : false;
    }
  };

  createUser = () => {
    console.log("createUser fn _____________");
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
    console.log("updateVisits fn ____________");
    let db = this.state.db;
    let user = this.state.name;
    let day = this.dateConversion();
    let count;
    // if (this.state.data && Object.keys(this.state.data).length > 1) {
    if (this.state.fetched) {
      count = this.state.data[`${user}`].signInLog[`${day}`].visits;
      count++;
      return db
        .ref(`/users/${user}/signInLog/${day}`)
        .child("visits")
        .set(count);
      }
  };

  updateLoginTime = () => {
    console.log("updateLoginTime fn _____________");
    let db = this.state.db;
    let user = this.state.name;
    let day = this.dateConversion();
    return db
      .ref(`/users/${user}/signInLog/${day}`)
      .child("lastLogin")
      .set(this.timeStamp());
  };

  todayExists = () => {
    console.log("todayExists fn _____________");
    let deebee = this.state.data;
    let user = this.state.name;
    let today = this.dateConversion();
    if (deebee[user]["signInLog"].hasOwnProperty(today)) {
          console.log("today exists!");
          return true;
    } else {
      console.log("today doesnt exist!");
      return false;
    }
  };

  updateDBCopy = () => { this.fetchDB() };

  timeStamp = () => {
    return new Date().toLocaleString('en-US', { timeZone: 'America/Denver' })
  };

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
    if (this.state.fetched && this.state.name) {
      return (
        <section>
          <button className="btn">
            <a href="/">Go Home</a>
          </button>
          <button className="btn" onClick={this.props.auth.logout}>Logout</button>
          <article className="doggo-dashboard">
            <h3>Doggo Dashboard</h3>
            <div className="card-container flex-col">
              <div className="doggo-card flex-row">
                <div className="doggo-title">
                  <h4>FRANKLIN</h4>
                  <img className="frank" src="" alt="" />
                </div>
                <div className="status">
                  <div>
                    <p>Breakfast</p>
                    <div className="bfast-status">
                      <p>[ ]</p>
                      <button className="btn feed-btn">FEED</button>
                    </div>
                    <small>{this.timeStamp()}</small>
                  </div>
                  <div>
                    <p>Dinner</p>
                    <div className="dinner-status">
                      <p>[ ]</p>
                      <button className="btn feed-btn">FEED</button>
                    </div>
                    <small>{this.timeStamp()}</small>
                  </div>
                </div>
              </div>

              <div className="doggo-card flex-row">
                <div className="doggo-title">
                  <h4>PAWBLO</h4>
                  <img className="pawblo" src="" alt="" />
                </div>
                <div className="status">
                  <div>
                    <p>Breakfast</p>
                    <div className="bfast-status">
                      <p>[ ]</p>
                      <button className="btn feed-btn">FEED</button>
                    </div>
                    <small>{this.timeStamp()}</small>
                  </div>
                  <div>
                    <p>Dinner</p>
                    <div className="dinner-status">
                      <p>[ ]</p>
                      <button className="btn feed-btn">FEED</button>
                    </div>
                  <small>{this.timeStamp()}</small>
                  </div>
                </div>
              </div>

              <div className="doggo-card flex-row">
                <div className="doggo-title">
                  <h4>ZERO</h4>
                  <img className="zero" src="" alt="" />
                </div>
                <div className="status">
                  <div>
                    <p>Breakfast</p>
                    <div className="bfast-status">
                      <p>[ ]</p>
                      <button className="btn feed-btn">FEED</button>
                    </div>
                    <small>{this.timeStamp()}</small>
                  </div>
                  <div>
                    <p>Dinner</p>
                    <div className="dinner-status">
                      <p>[ ]</p>
                      <button className="btn feed-btn">FEED</button>
                    </div>
                    <small>{this.timeStamp()}</small>
                  </div>
                </div>
              </div>

            </div>
          </article>
        </section>
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
    this.fetchDB();
  };

  render() {
    return this.dataLoaded();
  };
}
