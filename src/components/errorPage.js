import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class ErrorPage extends Component {
  render() {
    if (!this.props.status) {
      return null;
    }
    return (
      <div className="error-container container">
        <div className="error-content">
          <h1>Oops, Something went wrong..</h1>
          <p>{this.props.status + " " + this.props.statusText + " "}</p>
          <p>{this.props.message}</p>
          <Link
            className="btn waves-effect waves-light red lighten-1 from-btn"
            to="/"
          >
            Back to home
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
  null
)(ErrorPage);
