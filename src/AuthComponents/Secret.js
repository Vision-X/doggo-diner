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
      today: this.dateConversion()
    };
    this.mounted = false;
  };

  fetchDB = () => {
    console.log("fetchDB fn _____________");
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
      .catch()
  };

  saveDBCopy = user => {
    console.log("saveDBCopy fn ___________");
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
          } else {
            console.log("uppppppdddddaaateeeeeee user");
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
    console.log("saveFeedData fn ____________");
    console.log("user ", user);
    let fetchedDB;
    let feedLog = this.state.db.ref("/feedlog");
    feedLog.on("value", (snap => {
      fetchedDB = snap.exportVal();
      console.log(fetchedDB);
      if (fetchedDB[`${this.state.today}`]) {
        console.log("feedDay exists, store it in DB");
        this.setState({
          feedData: fetchedDB
        })
      } else {
        console.log("create feed log day here");
        this.createFeedLogDay();
      }
    }))
  }

  lawgFeedData = () => console.log(this.state.feedData);

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

  createFeedLogDay = () => {
    console.log("createFeedLogDay fn ______________");
    let today = this.state.today;
      console.log("feedlog day doesnt exist");
      this.state.db.ref(`/feedlog/`).update({
        [`${today}`]: {
          breakfast: {
            franklin: false,
            pawblo: false,
            zero: false
          },
          dinner: {
            franklin: false,
            pawblo: false,
            zero: false
          }
        }
      })
  }
  
  updateDoggo = (doggo, meal) => {
    console.log("updateDoggo fn ______________");
    let day = this.state.today;
    if (this.state.feedData.hasOwnProperty(day)) {
      this.state.db.ref(`/feedlog/${day}/${meal}/`).update({
        [`${doggo}`]: this.state.name + " " + this.timeStamp().split(',')[1]
      }, (error) => {
          if (error) {
            console.error(error);
            return;
          }
        console.log("FeedUpdateSuccessfulllllllll");
      }).then(() => {
          this.saveFeedData(this.state.name)
      })
    }
  }

  updateVisits = () => {
    console.log("updateVisits fn ____________");
    let db = this.state.db;
    let user = this.state.name;
    let day = this.state.today;
    let count;
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
    this.updateDoggo(key, string)
  }

  dataLoaded = () => {
    if (this.state.fetched && this.state.name && this.state.feedData) {
      let keyo = 0;
      let todaysFeed;
      let dogNames = ['franklin', 'pawblo', 'zero'];
      if (this.state.feedData[this.state.today]) {
        console.log("frank existsssssss");
        todaysFeed = this.state.feedData[this.state.today];
      } else {
        console.log("todaysFeed is fucked in dataLoaded");
        this.fetchDB()
      }
      return (
        <section>
          <button className="btn">
            <a href="/">Go Home</a>
          </button>
          <button className="btn" onClick={this.props.auth.logout}>Logout</button>
          <article className="doggo-dashboard">
            <h3>{this.dateConversion()}</h3>
            <div className="card-container flex-col">
            {console.log("SKREEPS", (todaysFeed))}
            {
              (Object.keys([todaysFeed][0]) !== null && dogNames).map(key => {
                keyo++;
                return (
                  <div className="doggo-card flex-row" key={keyo}>
                    <div className="doggo-title">
                      <h4>{key.toUpperCase()}</h4>
                      <div className={key} />
                    </div>
                    <div className="status">
                      <div className="bfast">
                        <p>Breakfast</p>
                        <div className="bfast-status">
                          {todaysFeed.breakfast != undefined &&
                          todaysFeed.breakfast[key]
                            ? [
                                <i className="checked" />,
                                <button
                                  type="button"
                                  className="feed-btn disabled"
                                  disabled="disabled"
                                >
                                  FED!!
                                </button>
                              ]
                            : [
                                <i className="unchecked" />,
                                <button
                                  type="button"
                                  className="feed-btn"
                                  onClick={event => this.updateDoggo(key, "breakfast")}
                                >
                                  FEED
                                </button>
                              ]}
                        </div>
                        <small>
                          {todaysFeed.breakfast[key].length
                            ? todaysFeed.breakfast[key]
                            : `${key.toUpperCase()} needs breakfast`}
                        </small>
                      </div>
                      <div className="dinner">
                        <p>Dinner</p>
                        <div className="dinner-status">
                          {todaysFeed.dinner != undefined &&
                          todaysFeed.dinner[key]
                            ? [
                                <i className="checked" />,
                                <button
                                  type="button"
                                  className="feed-btn disabled"
                                  disabled="disabled"
                                >
                                  FED!!
                                </button>
                              ]
                            : [
                                <i className="unchecked" />,
                                <button
                                  type="button"
                                  className="feed-btn"
                                  onClick={event => this.updateDoggo(key, "dinner")}
                                >
                                  FEED
                                </button>
                              ]}
                        </div>
                        <small>
                          {todaysFeed.dinner[key].length
                            ? todaysFeed.dinner[key]
                            : `${key.toUpperCase()} needs dinner`}
                        </small>
                      </div>
                    </div>
                  </div>
                );
              })
            }
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
