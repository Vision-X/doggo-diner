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
      this.setState({ data: snoog,
        name: user,
        fetched: true
      })
    }).then(() => this.lawgState())
      .then(() =>  {
        if (this.userExists()) {

        }
      })
    //check userExists
    return true;
  };

  fetchDBthenState = new Promise((resolve, reject) => {
    // this.fetchDb
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
        // return true;
        if (this.todayExists()) {
          this.updateVisits();
          // this.createDay();
          //
          console.log("todayExists");
        } else {
          console.log("todayDoesntExist");
          // this.createDay()
          // this.updateVisits()
        }
      } else {
        // return false;
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

  createDay = () => {
    let today = this.dateConversion();
    let user = this.state.name;
    // this.state.db.ref(`/users/${user}/signInLog/${today}`).set("/visits")
    this.state.db.ref(`/users/${user}/signInLog`).set({
                    [`${today}`]: {
                      lastLogin: this.timeStamp(),
                      visits: 1
                    }
  });
}

  updateUser = () => {
    // this.updateVisits(this.state.db, path, this.state.name, this.dateConversion(), this.state.data[this.state.name].signInLog[this.dateConversion()].visits)
    this.updateLoginTime();
    //this.updateDBCopy()
  };

  updateVisits = () => {
    let deebo = this.state.db;
    let user = this.state.name;
    let day = this.dateConversion();
    let dayIsTrue = this.state.data[`${user}`].signInLog.hasOwnProperty(day)
    if (dayIsTrue) {
      let count = this.state.data[`${user}`].signInLog[`${day}`].visits || 0;
      count++;
      console.log(count);
      console.log("day is true");
      return deebo
          .ref(`/users/${user}/signInLog/${day}`)
          .child("visits")
          .set(count);
    } else {
      console.log("gonna need to create a day in updateVisits");
    }
  }

  updateLoginTime = (db, path, day) => {
    return db
          .ref(`${path}/${day}`)
          .child("lastLogin")
          .set(this.timeStamp());
  }

  todayExists = () => {
    let deebs = this.state.data;
    let user = this.state.name;
    let today = this.dateConversion();
    let superRef = this.state.db.ref(`/users/${user}/signInLog/${today}`)
    if (superRef !== null) {
      // if (childSnap.child(`signInLog/${today}`) !== null) {
    // if (deebs[user]["signInLog"].hasOwnProperty(today)) {
          // console.log(childSnap.child(`signInLog/${today}/visits`).val());
          console.log("is today");
          // count = childSnap.child(`signInLog/${today}/visits`).val();
          return true;
    } else {
      // this.createDay()
      console.log("doesnt exist");
      return false;
    }
  };

  // updateDay = () => {
  //
  // };

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
      console.log("YOLO");
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

  componentDidMount() {
    // this.fetchUsrData();
    this.fetchDB();
  }

  render() {
    return this.dataLoaded();
  }
}
