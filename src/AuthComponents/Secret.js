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
        this.saveName(data.name);
        // return data.name
      })
      // .then((nom) => this.saveDBCopy(nom))
      // .then(() => this.saveDBCopy()))
      .then(() => this.fetchDBthenState.then((val) => {
        if (val) {
          this.saveDBCopy(this.state.name)
        }
      }))
      .catch()
  };

    // let derpy = new Promise((resolve, reject) => {
    //   if (this.validUsr(user)) resolve(true)
    //   else resolve(true)
    // })
    // derpy.then((value) => console.log(value))

  fetchDBthenState = new Promise((resolve, reject) => {
    if (this.state && this.state.data && Object.keys(this.state.data).length > 1) {
      resolve(true);
    } else { resolve(false) }
  });

  saveName = user => this.setState({ name: user }, this.logName());

  logName = () => console.log(this.state.name);

  saveDBCopy = user => {
    console.log("saveDBCopy");
    console.log("user ", user);
    // let user = this.state.name;
    let snoog;
    let userList = this.state.db.ref("/users");
    userList.once("value").then(snap => {
      snoog = snap.exportVal();
      this.setState({ data: snoog,
                      name: user,
                      fetched: true
                    })
    });
    //check userExists
    return true;
  };

  userExists = () => {
    console.log("userExists");
    console.log("YOLO");
    let user = this.state.name;
    console.log("user ", user);
    console.log("data? ", this.state.data);
    if (this.state.data && Object.keys(this.state.data).length > 1) {
      console.log("DOLO");
      let ayy = Object.keys(this.state.data);
      console.log(user);
      if (this.state.data.hasOwnProperty(user)) {
        console.log("SOLO");
        return true;
      } else {
        return false;
      }
    }
  };

  createUser = () => {
    let user = this.state.name;
    let today = this.dateConversion();
    this.state.db.ref(`/users/${user}`)
          .set({
            joined: this.timeStamp(),
            recent: "",
            signInLog: {
              [`${today}`]: {
                lastLogin: this.timeStamp(),
                visits: 1
              }
            }
          })
  };

  createDay = (user, today) => {
    // let today = this.dateConversion();
    // let user = this.state.name;
    this.state.db.ref(`/users/${user}/signInLog`).set(today)
  };

  updateUser = () => {
    this.updateVisits()
    this.updateLoginTime();
    //this.updateDBCopy()
  };

  updateVisits = (db, path, user, day, count) => {
    return db
          .ref(`/users/${user}/signInLog/${day}`)
          .child("visits")
          .set(count);
  }

  updateLoginTime = (db, path, day) => {
    return db
          .ref(`${path}/${day}`)
          .child("lastLogin")
          .set(this.timeStamp());
  }

  todayExists = () => {
    let user = this.state.name;
    let today = this.dateConversion();
    let superRef = this.state.db.ref(`/users/${user}/signInLog/${today}`)
    if (superRef !== null) {
      // if (childSnap.child(`signInLog/${today}`) !== null) {
        // if (deebs[user]["signInLog"].hasOwnProperty(today)) {
          // console.log(childSnap.child(`signInLog/${today}/visits`).val());
          console.log("is today");
          // count = childSnap.child(`signInLog/${today}/visits`).val();
    } else {
      this.createDay().then()
    }
  };

  // updateDay = () => {
  //
  // };

  updateDBCopy = () => { this.fetchDB() };


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
      // .then(data => this.validUsr(data.name))
      .catch(error => console.log(error));
  };

  // setName = name => {
  //   this.setState({
  //     name: name,
  //     fetched: true
  //   }, this.saveDBToState(name))
  //   //
  //   localStorage.setItem("name", name);
  // };

  // saveDBToState = user => {
  //   let snoog;
  //   let userList = this.state.db.ref("/users");
  //   userList.once("value").then(snap => {
  //     snoog = snap.exportVal();
  //     this.setState({ data: snoog,
  //                     name: user,
  //                     fetched: true
  //                   })
  //   }).then(() => {
  //     //
  //     if (this.state.data && this.state.name.length) {
  //       this.isValidUsr(this.state.name);
  //       console.log(this.state.data);
  //     }
  //   })
  // }

  // updateDB = () => {
  //   let token = localStorage.getItem("access_token");
  //   return fetch("https://3788high.auth0.com/userinfo", {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   }).then(res => res.json())
  //     .then(data => this.saveDBToState(data.name))
  //     .catch()
  // }

  // validUsr = user => {
  //   console.log("YOLO");
  //   if (this.state.data && Object.keys(this.state.data).length > 1) {
  //     console.log("DOLO");
  //     let ayy = Object.keys(this.state.data);
  //     console.log(user);
  //     console.log(ayy.map(u => console.log(u)));
  //     if (this.state.data.hasOwnProperty(user)) {
  //       console.log("SOLO");
  //       this.checkUsr(user);
  //       return true;
  //     } else {
  //       // this.checkUsr(user);
  //       return false;
  //     }
  //   // }
  // }

  // isValidUsr = user => {
  //   let derpy = new Promise((resolve, reject) => {
  //     if (this.validUsr(user)) return resolve(true)
  //     else return resolve(true)
  //   })
  //   derpy.then((value) => console.log(value))
  // }


  // checkUsr = user => {
  // //   console.log("checkUsr called");
  // //   // this.updateDB(user);
  // //   // this.state.db.ref("/users").set({ })
  // //   // this.state.db.ref(`/users/${user}`).set({
  // //   //     joined: this.timeStamp(),
  // //   //     recent: "",
  // //   //     signInLog: {
  // //   //       lastLogin: this.timeStamp(),
  // //   //       visits: 1
  // //   //    }
  // //   // });
  // //
  // //
  //   // let derpy = new Promise((resolve, reject) => {
  //   //   if (this.validUsr(user)) resolve(true)
  //   //   else resolve(true)
  //   // })
  //   // derpy.then((value) => console.log(value))
  //   let deebee = this.state.db;
  //   console.log(deebee);
  //
  //
  //   // let deebs = this.state.data;
  //   let today = this.dateConversion().replace(/\//g, "-");
  //   // console.log(deebs[user]["signInLog"].hasOwnProperty(today));
  //   // user = "Franklin"
  //   let reff = this.state.db.ref("/users");
  //   let signInLog = `/users/${user}/signInLog`;
  //   reff.on("value", ((snap) => {
  //       let nosed = snap.exportVal();
  //       // console.log(snap.exportVal());
  //       snap.forEach(childSnap => {
  //       let name = childSnap.key;
  //       console.log(name, user);
  //       if (Object.keys(nosed).includes(user)) {
  //         console.log("MATCHES");
  //           let count;
  //           if (childSnap.child(`signInLog/${today}`) !== null) {
  //           // if (deebs[user]["signInLog"].hasOwnProperty(today)) {
  //               // console.log(childSnap.child(`signInLog/${today}/visits`).val());
  //               console.log("is today");
  //               count = childSnap.child(`signInLog/${today}/visits`).val();
  //               // count += 1;
  //               console.log(count, "???");
  //               this.updateVisits(deebee, signInLog, user, today, count);
  //               this.updateLoginTime(deebee, signInLog, today);
  //               return true;
  //           } else if (childSnap.child(`signInLog/${today}`) == null) {
  //               console.log("no today");
  //               count = 1;
  //               deebee.ref(signInLog).set(today);
  //               this.updateVisits(deebee, signInLog, today, count);
  //               this.updateLoginTime(deebee, signInLog, today);
  //               return true;
  //           // deebee
  //           //   .ref(`${signInLog}/${today}`)
  //           //   .child("lastLogin")
  //           //   .set(this.timeStamp());
  //               // return true;
  //               //
  //               //
  //             } else {
  //               return "";
  //             }
  //             return true;
  //   } else {
  //       console.log("NO MATCHES!");
  //       deebee.ref(`/users/${user}`)
  //             .set({
  //               joined: this.timeStamp(),
  //               recent: "",
  //               signInLog: {
  //                 [`${today}`]: {
  //                   lastLogin: this.timeStamp(),
  //                   visits: 1
  //                 }
  //               }
  //             });
  //       return false;
  //     }
  //     })
  //   })
  // )
  // // })
  // };


  // createUsr = (db, user, today) => {
  //   db.ref(`/users/${user}`).set({
  //     joined: this.timeStamp(),
  //     recent: "",
  //     signInLog: {
  //       [`${today}`]: {
  //         lastLogin: this.timeStamp(),
  //         visits: 1
  //       }
  //     }
  //   });
  // };


  // updateVisits = (db, path, user, day, count) => {
  //   console.log("update visits____________");
  //   console.log("1, ",db);
  //   console.log("2, ", path);
  //   console.log("3, ", day);
  //   console.log("4, ", count);
  //   count++;
  //   return db
  //         .ref(`/users/${user}/signInLog/${day}`)
  //         .child("visits")
  //         .set(count);
  // }

  // updateLoginTime = (db, path, day) => {
  //   return db
  //         .ref(`${path}/${day}`)
  //         .child("lastLogin")
  //         .set(this.timeStamp());
  // }

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
    if (this.state.fetched && this.state.name && this.state.name.length) {
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
    this.fetchDB();
  }

  render() {
    return this.dataLoaded();
  }
}
