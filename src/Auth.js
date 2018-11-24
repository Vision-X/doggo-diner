import auth0 from 'auth0-js';

const LOGIN_SUCCESS_PAGE = "/skrttt";
const LOGIN_FAILURE_PAGE = "/";

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: "3788high.auth0",
    clientID: "XZYjm9QQzH3vDv1FmwBf2Mf5GDz8q4n-",
    redirectUri: "http://localhost:3000/callback",
    audience: "https://3788high.auth0.com/userinfo",
    responseType: "token id_token",
    scope: "openid"
  })

  constuctor = () => this.login = this.login.bind(this)

  login = () => this.auth0.authorize()

  handleAuth = () => {
    this.auth0.parseHash((err, authResults) => {
      if (authResults && authResults.accessToken && authResults.idToken) {
        let expiry = JSON.stringify((authResults.expiresIn) * 1000 + new Date().getTime())
        localStorage.setItem("access_token", authResults.accessToken);
        localStorage.setItem("id_token", authResults.idToken);
        localStorage.setItem("expires_at", expiry);
        location.hash = "";
        location.pathname = LOGIN_SUCCESS_PAGE;
      } else if (err) {
        location.pathname = LOGIN_FAILURE_PAGE;
      }
    })
  }

  isAuthenticated = () => {
    let expires_at = JSON.parse(localStorage.getItem("expires_at"));
    return new Date().getTime() < expires_at
  }

  logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    location.pathname = LOGIN_FAILURE_PAGE;
  }
}
