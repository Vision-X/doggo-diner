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
      data: {},
      today: "12-04-2018"
    };
    this.mounted = false;
    // this._onClick = this._onClick.bind(this)
  };

  fetchDB = () => {
    console.log("fetchDB");
    if (this.state.fetched) {
      this.setState({ fetched: false })
    }
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
      .then((usr) => this.saveFeedData(usr))
      // .then(() => console.log(this.state.feedData))
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
        if (this.state.fetched && this.userExists()) {
          if (!this.todayExists()) {
            this.createDay();
            // this.updateVisits();
          } else {
            console.log("uppppppdddddaaateeeeeee");
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
    return user;
  };

  saveFeedData = user => {
    console.log("saveFeedData");
    console.log("user ", user);
    let fetchedDB;
    let feedLog = this.state.db.ref("/feedlog");
    feedLog.once("value").then(snap => {
      fetchedDB = snap.exportVal();
      this.setState({
        feedData: fetchedDB
      })
    });
  }

  // fetchDBthenState = new Promise((resolve, reject) => {
  //   if (this.state && this.state.data && Object.keys(this.state.data).length > 1) {
  //     console.log("we have state data!!!");
  //     resolve(true);
  //   } else {
  //     reject(false);
  //   }
  // });

  saveName = user => this.setState({ name: user }, this.logName());

  logName = () => console.log("logName... ", this.state.name);

  lawgState = () => console.log("lawgState... ", this.state);

  userExists = () => {
    console.log("userExists fn ____________");
    let user = this.state.name;
    if (this.dbIsSaved() && Object.keys(this.state.data).length > 1 && user !== undefined) {
      let ayy = Object.keys(this.state.data);
      console.log("userExists? ", this.state.data.hasOwnProperty(user));
      return (this.state.data.hasOwnProperty(user)) ? true : false;
    }
  };

  dbIsSaved = () => {
    return (this.state.data.hasOwnProperty("Franklin")) ? true : false;
  };

  createUser = () => {
    console.log("createUser fn _____________");
    let user = this.state.name;
    let today = this.state.today;
    if (this.dbIsSaved() && Object.keys(this.state.data).length > 1 && user !== undefined) {
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
    }
  };

  createDay = () => {
    console.log("createDay fn _____________");
    let today = this.state.today;
    let user = this.state.name;
    this.state.db.ref(`/users/${user}/signInLog`).update({
      [`${today}`]: {
        lastLogin: this.timeStamp(),
        visits: 1
      }
    });
  };

  updateDoggo = (doggo, meal) => {
    let day = this.state.today;
    if (this.state.feedData.hasOwnProperty(day)) {
      this.state.db.ref(`/feedlog/${day}/${doggo}/${meal}`).update({
        fed: true,
        fedBy: this.state.name,
        fedTime: this.timeStamp()
      }, (error) => {
          if (error) {
            console.error(error);
            return;
          }
        console.log("UpdateSuccessfulllllllll");
      }).then(() => {
          this.saveFeedData(this.state.name)
      })
    }
        // this.setState({
        //   feedData: {
        //     `${day}`:
        //       {
        //         `${doggo}`:
        //           {
        //             `${meal}`:
        //               {
        //                 fed: true,
        //                 fedBy: this.state.name,
        //                 fedTime: this.state.db.ref(`/feedlog/${day}/${doggo}/${meal}/fedTime`);
        //               }
        //           }
        //       }
        // this.setState({ feedData.day.doggo.meal.fed: true )};
        // console.log(this.state.feedData[`${day}`]);
        // this.state.feedData[`${day}/${doggo}/${meal}/fedBy`] = this.state.name;
        // this.state.feedData[`${day}/${doggo}/${meal}/fedTime`] = this.timeStamp();
        // console.log(this.state.feedData[`${day}/${doggo}/${meal}/fedTime`]);

          // }[`${day}/${doggo}/${meal}`]:
          //           {
          //             fed: true,
          //             fedBy: this.state.name,
          //             fedTime: this.state.db.ref(`/feedlog/${day}/${doggo}/${meal}/fedTime`).val()
          //           }
    // })
  }

  updateFeedLog = () => {
    let today = this.state.today;
    if (this.state.db && this.state.db.ref(`/feedlog/${today}`) != undefined) {
      console.log("today exists");
      this.state.db.ref(`/feedlog/`).update({
        [`${today}`]: {
          franklin: {
            breakfast: {
              fed: true,
              fedBy: "",
              fedTime: ""
            },
            dinner: {
              fed: false,
              fedBy: "",
              fedTime: ""
            }
          },
          pawblo: {
            breakfast: {
              fed: true,
              fedBy: "",
              fedTime: ""
            },
            dinner: {
              fed: false,
              fedBy: "",
              fedTime: ""
            }
          },
          zero: {
            breakfast: {
              fed: true,
              fedBy: "",
              fedTime: ""
            },
            dinner: {
              fed: false,
              fedBy: "",
              fedTime: ""
            }
          }
        }
      });
    } else {
      console.log("today doesnt exist");
      this.state.db.ref(`/feedlog/`).update({
        [`${today}`]: {
          franklin: {
            breakfast: {
              fed: false,
              fedBy: "",
              fedTime: ""
            },
            dinner: {
              fed: false,
              fedBy: "",
              fedTime: ""
            }
          },
          pawblo: {
            breakfast: {
              fed: false,
              fedBy: "",
              fedTime: ""
            },
            dinner: {
              fed: false,
              fedBy: "",
              fedTime: ""
            }
          },
          zero: {
            breakfast: {
              fed: false,
              fedBy: "",
              fedTime: ""
            },
            dinner: {
              fed: false,
              fedBy: "",
              fedTime: ""
            }
          }
        }
      })
    }
  }


  // updateUser = () => {
  //   this.updateLoginTime();
  //   this.updateDBCopy()
  // };

  updateVisits = () => {
    console.log("updateVisits fn ____________");
    let db = this.state.db;
    let user = this.state.name;
    let day = this.state.today;
    let count;
    // if (this.state.data && Object.keys(this.state.data).length > 1) {
    if (this.state.fetched) {
      count = this.state.data[`${user}`].signInLog[`${day}`].visits;
      count++;
      // this.updateFeedLog()
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
    let day = this.state.today;
    return db
      .ref(`/users/${user}/signInLog/${day}`)
      .child("lastLogin")
      .set(this.timeStamp());
  };

  todayExists = () => {
    console.log("todayExists fn _____________");
    let deebee = this.state.data;
    let user = this.state.name;
    let today = this.state.today;
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

  _onClick(e, key, string) {
    e.preventDefault();
    console.log("clickkkkk");
    console.log(key);
    console.log(string);
    this.updateDoggo(key, string)
    let day = this.state.today;
    // this.state.db.ref(`/feedlog/${day}/`).on("child_changed", function(data) {
    //   console.log(data, data.val());
    // })
  }

  dataLoaded = () => {
    if (this.state.fetched && this.state.name && this.state.feedData) {
      let keyo = 0;
      let todaysFeed;
      if (this.state.feedData[this.state.today].hasOwnProperty("franklin")) {
        console.log("frank existsssssss");
        todaysFeed = this.state.feedData[`${this.state.today}`];
        console.log(todaysFeed);
      } else {
        console.log("todaysFeed is fucked in dataLoaded");
      }
      return (
        <section>
          <button className="btn">
            <a href="/">Go Home</a>
          </button>
          <button className="btn" onClick={this.props.auth.logout}>Logout</button>
          <article className="doggo-dashboard">
            {/*<h3>Doggo Dashboard</h3>*/}
            <h3></h3>
            <div className="card-container flex-col">


            {/*// map here!!! dynamically build doggo cards from DB data*/}
            { Object.keys([todaysFeed][0]) !== null && Object.keys([todaysFeed][0]).map(key => {
              console.log(key);
              console.log([todaysFeed][0][key]);
              keyo++;
              return (
                <div className="doggo-card flex-row" key={keyo}>
                  <div className="doggo-title">
                    <h4>{key.toUpperCase()}</h4>
                    <div className={key}></div>
                  </div>
                  <div className="status">
                    <div>
                      <p>Breakfast</p>
                      <div className="bfast-status">
                      {/*{(this.state.db.ref(`/feedlog/${this.state.today}/${key}`).breakfast) != undefined
                        && (this.state.db.ref(`/feedlog/${this.state.today}/${key}`).breakfast.fed)
                                                        ? console.log("FED: TRUE")
                                                        : console.log("FED: FALSE")}*/}
                      { (todaysFeed[`${key}`].breakfast) != undefined
                        && (todaysFeed[`${key}`].breakfast.fed)
                                                        ? <i className="checked"></i>
                                                        : <i className="unchecked"></i>
                      }
                        <button
                          type="button"
                          className="btn feed-btn"
                          onClick={(event) => this.updateDoggo( key, "breakfast")}
                        >
                          FEED
                        </button>
                      </div>
                      <small>{this.timeStamp()}</small>
                    </div>
                    <div>
                      <p>Dinner</p>
                      <div className="dinner-status">
                      { (todaysFeed[`${key}`].dinner) != undefined
                        && (todaysFeed[`${key}`].dinner.fed)
                                                        ? <i className="checked"></i>
                                                        : <i className="unchecked"></i>
                      }
                        <button
                          type="button"
                          className="btn feed-btn"
                          onClick={(event) => this.updateDoggo(key, "dinner")}
                        >
                            FEED
                        </button>
                      </div>
                      <small>{this.timeStamp()}</small>
                    </div>
                  </div>
                </div>
                )
              })
            }
            {/* End of dynamic el build loop */}
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
    this.mounted = true;
    if (this.mounted) this.fetchDB();
  };

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    return this.dataLoaded();
  };
}
