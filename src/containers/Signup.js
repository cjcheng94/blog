import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import Alert from "react-s-alert";

import { userSignup } from "../actions/user";

class Signup extends Component {
  showAlert(message) {
    Alert.success(message, {
      position: "top-right",
      effect: "slide",
      timeout: 2000
    });
  }
  onComponentSubmit(values) {
    this.props.userSignup(values, () => {
      this.showAlert("Sign up successful!");
      this.props.history.push("/user/login");
    });
  }
  renderField(field) {
    const {
      meta: { touched, error }
    } = field;
    const className = `${touched && error ? "invalid" : ""}`;
    const type = field.input.name === 'username'? 'text': 'password';
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
      <div className="container">
        <h1>Sign up</h1>
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
          <div className="row">
            <Field name="confirm password" component={this.renderField} />
          </div>
            <input
              type="submit"
              value="Sign Up"
              className="btn waves-effect waves-light from-btn cyan darken-1"
            />
        </form>
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
  if (values.password !== values['confirm password']) {
    errors['confirm password'] = 'Passwords doesn\'t match'
  }
  //if the "errors" object is empty, the form is valid and ok to submit
  return errors;
}

export default reduxForm({
  validate,
  form: "SignUpForm"
})(
  connect(
    null,
    { userSignup }
  )(Signup)
);
