import { Component } from "react";
import "./App.css";
import { LoginTab } from "./components/login/login";
import { Pagex } from "./components/pages/index";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      auth_token: "empty..",
      user: "Guest",
      loggedIn: false,
    };
    this.signOut = this.signOut.bind(this);
  }
  componentDidMount() {
    console.log(" APP >> Did_Mount", this.state.auth_token);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.auth_token !== prevState.auth_token) {
      console.log(" APP >> Did_update >> ", this.state.auth_token);
    }
  }

  auth_info = (token, user) => {
    this.setState({ auth_token: token, user: user });
  };
  loggedIn = (loggedIn) => {
    this.setState({ loggedIn });
  };

  signOut = () => {
    this.setState({
      auth_token: "empty..",
      user: "Guest",
      loggedIn: false,
    });
  };
  render() {
    console.log(" APP >> Render");
    console.log(" APP >> Render >> login : ", this.state);

    return (
      <div className="App">
        <div className="wrapper">
          <header>
            <div className="top-wrapper">
              <div className="top-wrapper-title">
                Code-Base
              </div>
              {/* <Nav data={{
                    loggedIn: this.loggedIn,
                  }} /> */}
              <div
                className="Glogin"
                style={{
                  float: "right",
                  height: "auto",
                  width: "auto",
                  padding: 0,
                }}
              >
                <LoginTab
                  data={{
                    auth_info: this.auth_info,
                    signout: this.signOut,
                    loggedIn: this.loggedIn,
                    loggedIn: this.loggedIn,
                  }}
                />
              </div>
            </div>
          </header>
          <main className="main-wrapper" role="main">
            <section id="Admin-Section">
              {this.state.loggedIn === true ? (
                <>
                  <Pagex />
                </>
              ) : (
                <div className="login-page">
                  <h1> Welcome to Code-Base Web App</h1>
                  <h2> Log In with Google</h2>
                  <h2> </h2>
                  <h2> </h2>
                  <h2> </h2>
                  <h2> </h2>
                  <h2> </h2>
                  <h2> </h2>
                  <h2> </h2>
                  <h2> </h2>
                  <h2> </h2>
                  <h2> </h2>
                  <h2> </h2>
                  <h2> </h2>
                  <h2> </h2>
                  <h2> </h2>
                  <h2> </h2>
                  <h2> </h2>
                  <h2> </h2>
                  <h2> </h2>
                  <h2> </h2>
                  <h2> </h2>
                  <h2> </h2>
                  <h2> </h2>
                  <h2> </h2>
                  <h2> </h2>
                  <h2> </h2>
                  <h2> </h2>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    );
  }
}

export default App;
