import React from "react";
import "./style.css";
import googleLogo from "./google.svg";
import logo from "../header/logo.png";
import { Fill } from "../icons";
import { actions } from "../../domain";
import { connect } from "react-redux";
import { login } from "../../api/firebase.login";

type Props = ReturnType<typeof mapState>;

class LoginPage extends React.Component<Props> {
  state = {
    isSigningIn: false,
  };

  onClick = () => {
    this.setState({ isSigningIn: true });
    login()
      .then((res) => {
        this.setState({ isSigningIn: false });
      })
      .catch((res) => {
        this.setState({ isSigningIn: false });
      });
  };

  renderButton = () => (
    <>
      <button className="login-button" onClick={this.onClick}>
        <img className="login_google-logo" src={googleLogo} alt="" /> Sign in
        with Google
      </button>
      <small className="login-text">
        You will be registered automagically if needed
      </small>
    </>
  );

  renderLoading = () => (
    <>
      <div className="lds-ripple center">
        <div></div>
        <div></div>
      </div>
      <div className="google-wait-text">Waiting for Google popup</div>
    </>
  );

  render() {
    return (
      <div className="login-container">
        <div className="login-form">
          <img className="login-logo logo" src={logo} alt="" />
          {this.state.isSigningIn ? this.renderLoading() : this.renderButton()}
        </div>

        <div className="paint-button">
          <Fill
            className="icon fill-icon"
            onClick={() =>
              actions.setColorScheme(
                this.props.themeColor === "dark" ? "light" : "dark"
              )
            }
          />
        </div>
      </div>
    );
  }
}
const mapState = (state: MyState) => ({
  themeColor: state.colorScheme,
});

export default connect(mapState)(LoginPage);
