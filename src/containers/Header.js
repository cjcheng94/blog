import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Alert from "react-s-alert";
import { userLogout } from "../actions/user";

import HeaderButton from "../components/headerButton";

const buttonList = [
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
    Alert.info(message, {
      position: "top-right",
      effect: "slide",
      timeout: 2000,
      offset: "50px"
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
      ? buttonList.slice(0, 1)
      : buttonList.slice(1);
    return (
      <div>
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
                {this.props.isAuthenticated ? (
                  <li>
                    <Link to={`/user/profile/${this.props.username}`}>
                      {this.props.username}
                    </Link>
                  </li>
                ) : null}
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
        {this.props.isPending ? (
          <div className="progress">
            <div className="indeterminate" />
          </div>
        ) : (
          <div className="placeholder" />
        )}
      </div>
    );
  }
}

const mapStateToProps = ({
  isPending,
  user: { isAuthenticated, username }
}) => ({
  isAuthenticated,
  isPending,
  username
});

export default connect(
  mapStateToProps,
  { userLogout }
)(Header);
