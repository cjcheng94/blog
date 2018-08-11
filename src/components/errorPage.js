import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { clearError } from "../actions/clearError";

class ErrorPage extends Component {
  render() {
    const { type, status, statusText, message, clearError } = this.props;
    let customMessage = "";
    switch (type) {
      case "login":
        customMessage = "Password Incorrect or user doesn't exist";
        break;
      case "signup":
        customMessage = "User already exists";
        break;
      case "postNew":
        customMessage = "Login expired, please log in again";
        break;
      case "postUpdate":
        customMessage = "Unauthorized or Login expired, please log in again";
        break;
      case "postDetail":
        customMessage = "Unauthorized or Login expired, please log in again";
        break;
      default:
        break;
    }
    return (
      <div className="error-container">
        <div className="error-content">
          <h6>Oops, Something went wrong..</h6>
          {status !== 500 && status !== 404 ? (
            <h5>{customMessage}</h5>
          ) : (
            <div>
              <p>{status + " " + statusText}</p>
              <p>{message}</p>
            </div>
          )}
          <a
            className="btn waves-effect waves-light cyan lighten-1 from-btn"
            onClick={() => {
              clearError();
            }}
          >
            Back
          </a>
          <Link
            className="btn waves-effect waves-light red lighten-1 from-btn"
            to="/"
          >
            Home
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ error: { status, statusText, message } }) => ({
  status,
  statusText,
  message
});

export default connect(
  mapStateToProps,
  { clearError }
)(ErrorPage);
