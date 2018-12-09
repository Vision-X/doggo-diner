import auth0 from 'auth0-js';
import dotenv from 'dotenv';

const LOGIN_SUCCESS_PAGE = "/secret";
const LOGIN_FAILURE_PAGE = "/";

class Auth {

  auth0 = new auth0.WebAuth({
    domain: process.env.REACT_APP_DOMAIN,
    clientID: process.env.REACT_APP_CLIENT_ID,
    // redirectUri: "http://localhost:3000/callback",
    redirectUri: "https://n-high-st.firebaseapp.com/callback",
    audience: process.env.REACT_APP_AUDIENCE,
    responseType: "token id_token",
    scope: "openid email profile"
  })


  login = () => {
    this.auth0.authorize()
  }

  handleAuth = () => {
    let tA = this.auth0;
    tA.parseHash((err, authResults) => {
      if (authResults && authResults.accessToken && authResults.idToken) {
        let expiry = JSON.stringify((authResults.expiresIn) * 1000 + new Date().getTime())
        localStorage.setItem("access_token", authResults.accessToken);
        localStorage.setItem("id_token", authResults.idToken);
        localStorage.setItem("expires_at", expiry);
        window.location.hash = "";
        window.location.pathname = LOGIN_SUCCESS_PAGE;
      } else if (err) {
        window.location.pathname = LOGIN_FAILURE_PAGE;
      }
    })
  }

  isAuthenticated() {
    let expires_at = JSON.parse(localStorage.getItem("expires_at"));
    return new Date().getTime() < expires_at
  }

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    window.location.pathname = LOGIN_FAILURE_PAGE;
  }
}

export default Auth;
