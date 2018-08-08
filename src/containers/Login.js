import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import Alert from "react-s-alert";

import { userLogin } from "../actions/user";

class Login extends Component {
  showAlert(message) {
    Alert.success(message, {
      position: "top-right",
      effect: "slide",
      timeout: 2000
    });
  }
  onComponentSubmit(values) {
    this.props.userLogin(values, () => {
      this.showAlert("Login successful!");
      this.props.history.push("/");
    });
  }
  renderField(field) {
    const {
      meta: { touched, error }
    } = field;
    const className = `${touched && error ? "invalid" : ""}`;
    const type = field.input.name === "password" ? "password" : "text";
    return (
      <div className="input-field col s6">
        <input
          className={className}
          id={field.input.name}
          type={type}
          {...field.input}
        />
        <label htmlFor={field.input.name}>{field.input.name}</label>
        <span className="helper-text red-text">{touched ? error : ""}</span>
      </div>
    );
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <div>
        {this.props.isFetching ? (
          <div className="progress">
            <div className="indeterminate" />
          </div>
        ) : null}
        <div className="container">
          <h1>Log in</h1>
          <form
            className="col s12"
            onSubmit={handleSubmit(this.onComponentSubmit.bind(this))}
          >
            <div className="row">
              <Field name="username" component={this.renderField} />
            </div>
            <div className="row">
              <Field name="password" component={this.renderField} />
            </div>
            <input
              type="submit"
              value="Log in"
              className="btn waves-effect waves-light from-btn cyan darken-1"
            />
          </form>
        </div>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};
  // Validate the inputs from 'values'
  if (!values.username) {
    errors.username = "Please enter a username";
  }
  if (!values.password) {
    errors.password = "Please enter a password";
  }

  //if the "errors" object is empty, the form is valid and ok to submit
  return errors;
}

function mapStateToProps(state) {
  return { isFetching: state.user.isFetching };
}

export default reduxForm({
  validate,
  form: "LoginForm"
})(
  connect(
    mapStateToProps,
    { userLogin }
  )(Login)
);
