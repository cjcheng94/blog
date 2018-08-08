import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Alert from "react-s-alert";

import { userLogout } from "../actions/user";

import HeaderButton from "../components/headerButton";

const buttonList = [
  {
    to: "/",
    text: "Home"
  },
  {
    to: "/posts/new",
    text: "Write"
  },
  {
    to: "/user/signup",
    text: "Sign Up"
  },
  {
    to: "/user/login",
    text: "Log In"
  }
];
class Header extends Component {
  showAlert(message) {
    Alert.success(message, {
      position: "top-right",
      effect: "slide",
      timeout: 2000
    });
  }
  handleLogoutClick(e) {
    e.preventDefault();
    this.props.userLogout(() => {
      this.showAlert("Logged out");
      setTimeout(() => this.props.history.push("/"), 1000);
    });
  }
  render() {
    const buttons = this.props.isAuthenticated
      ? buttonList.slice(0, 2)
      : buttonList.slice(2);
    return (
      <div className="navbar-fixed">
        <nav className="cyan darken-1">
          <div className="nav-wrapper container">
            <Link
              to="/"
              className="brand-logo left"
              style={{
                textShadow:
                  "2px 2px 0px #b2ebf2,4px 4px 0px #4dd0e1,6px 6px 0px #00bcd4"
              }}
            >
              Blog!
            </Link>
            <ul id="nav-mobile" className="right">
              {buttons.map(button => {
                return (
                  <HeaderButton
                    key={button.to}
                    to={button.to}
                    text={button.text}
                  />
                );
              })}
              {this.props.isAuthenticated ? (
                <li className="waves-effect waves-light">
                  <a onClick={this.handleLogoutClick.bind(this)}>Log out</a>
                </li>
              ) : null}
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

const mapStateToProps = ({ user: { isAuthenticated } }) => ({
  isAuthenticated
});

export default connect(
  mapStateToProps,
  { userLogout }
)(Header);
