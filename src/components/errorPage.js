import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { clearError } from "../actions/clearError";

class ErrorPage extends Component {
  render() {
    const { type, status, statusText, message, clearError } = this.props;

    //Custom messages for different errors
    const customMessage = {
      login: "Password Incorrect or user doesn't exist",
      signup: "User already exists",
      postNew: "Login expired, please log in again",
      postUpdate: "Unauthorized or Login expired, please log in again",
      postDetail: "Unauthorized or Login expired, please log in again"
    }

    return (
      <div className="error-container">
        <div className="error-content">
          <h6>Oops, Something went wrong..</h6>
          {
            // Use server error messages for status code 500 and 404
            status !== 500 && status !== 404 ? (
            <h5>{customMessage[type]}</h5>
          ) : (
            <div>
              <p>{status + " " + statusText}</p>
              <p>{message}</p>
            </div>
          )}
          <a
            className="btn waves-effect waves-light cyan lighten-1 from-btn"
            onClick={() => {
              clearError(); // Calls clearErrors() action
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
