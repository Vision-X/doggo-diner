import React, { Component } from "react";
import dotenv from "dotenv";
import { fire } from "../fire";

export default class Secret extends Component {
  constructor() {
    super();
    this.state = {
      fetched: false,
      name: "",
      db: fire.database()
    };
    this.fetchUsrData();
  }

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
      // .then(data => this.validUsr(data.name))
      .catch(error => console.log(error));
  };

  setName = name => {
    this.setState({
      name: name,
      fetched: true
    }, this.saveDBToState(name))
    //
    localStorage.setItem("name", name);
  };

  saveDBToState = user => {
    let snoog;
    let userList = this.state.db.ref("/users");
    userList.once("value").then(snap => {
      snoog = snap.exportVal();
      this.setState({ data: snoog })
    })
    this.checkUsr(user)
  }

  validUsr = user => {
    if (this.state.data && Object.keys(this.state.data).length) {
      if (this.state.data.hasOwnProperty(user)) {
        // this.checkUsr(user);
        return true;
      } else {
        return false;
      }
    }
  }

  checkUsr = user => {
    console.log("checkUsr called");
    // this.state.db.ref("/users").set({ })
    // this.state.db.ref(`/users/${user}`).set({
    //     joined: this.timeStamp(),
    //     recent: "",
    //     signInLog: {
    //       lastLogin: this.timeStamp(),
    //       visits: 1
    //    }
    // });
    let derpy = new Promise((resolve, reject) => {
      if (this.validUsr(user)) resolve(true)
      else resolve(true)
    })
    derpy.then((value) => console.log(value))
    let deebee = this.state.db;
    console.log(deebee);
    // let deebs = this.state.data;
    let today = this.dateConversion().replace(/\//g, "-");
    // console.log(deebs[user]["signInLog"].hasOwnProperty(today));
    user = "Franklin"
    let reff = this.state.db.ref("/users");
    let signInLog = `/users/${user}/signInLog`;
    reff.once("value").then((snap) => {
        let nosed = snap.exportVal();
        // console.log(snap.exportVal());
        snap.forEach(childSnap => {
        let name = childSnap.key;
        console.log(name, user);
        if (Object.keys(nosed).includes(user)) {
          console.log("MATCHES");
            let count;
            if (childSnap.child(`signInLog/${today}`) !== null) {
            // if (deebs[user]["signInLog"].hasOwnProperty(today)) {
                // console.log(childSnap.child(`signInLog/${today}/visits`).val());
                console.log("is today");
                count = childSnap.child(`signInLog/${today}/visits`).val();
                // count += 1;
                console.log(count, "???");
                this.updateVisits(deebee, signInLog, user, today, count);
                this.updateLoginTime(deebee, signInLog, today);
                return true;
            } else if (childSnap.child(`signInLog/${today}`) == null) {
                console.log("no today");
                count = 1;
                deebee.ref(signInLog).set(today);
                this.updateVisits(deebee, signInLog, today, count);
                this.updateLoginTime(deebee, signInLog, today);
                return true;
            // deebee
            //   .ref(`${signInLog}/${today}`)
            //   .child("lastLogin")
            //   .set(this.timeStamp());
                // return true;
                //
                //
              } else {
                return "";
              }
              return true;
    } else {
        console.log("NO MATCHES!");
        deebee.ref(`/users/${user}`)
              .set({
                joined: this.timeStamp(),
                recent: "",
                signInLog: {
                  [`${today}`]: {
                    lastLogin: this.timeStamp(),
                    visits: 1
                  }
                }
              });
        return false;
      }
      })
    })
  // })
  };

  createUsr = (db, user, today) => {
    db.ref(`/users/${user}`).set({
      joined: this.timeStamp(),
      recent: "",
      signInLog: {
        [`${today}`]: {
          lastLogin: this.timeStamp(),
          visits: 1
        }
      }
    });
  };


  updateVisits = (db, path, user, day, count) => {
    console.log("update visits____________");
    console.log("1, ",db);
    console.log("2, ", path);
    console.log("3, ", day);
    console.log("4, ", count);
    count++;
    return db
          .ref(`/users/${user}/signInLog/${day}`)
          .child("visits")
          .set(count);
  }
////
  updateLoginTime = (db, path, day) => {
    return db
          .ref(`${path}/${day}`)
          .child("lastLogin")
          .set(this.timeStamp());
  }

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
    today = mm + "/" + dd + "/" + yyyy;
    return today;
  };

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
    // this.fetchUsrData();
  }

  render() {
    return this.dataLoaded();
  }
}
