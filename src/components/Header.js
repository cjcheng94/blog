import React, { Component } from "react";
import { Link } from "react-router-dom";

class Header extends Component {
  render() {
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
              <li className="waves-effect waves-light">
                <Link to="/">Home</Link>
              </li>
              <li className="waves-effect waves-light">
                <Link to="/posts/new">Write</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default Header;
