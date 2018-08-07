import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
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
  render() {
    const buttons = this.props.authorized
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
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

const mapStateToProps = ({ user: { authorized } }) => ({ authorized });

export default connect(mapStateToProps)(Header);
