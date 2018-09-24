import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";

import ErrorPage from "../components/errorPage";
import { userLogin } from "../actions/user";

class Login extends Component {
  state = {
    open: false
  };

  showAlert() {
    this.setState({ open: true });
  }
  hideAlert() {
    this.setState({ open: false });
  }
  onComponentSubmit(values) {
    this.props.userLogin(values, () => {
      //Callback to execute when the action is resolved
      this.showAlert();
      setTimeout(() => this.props.history.push("/"), 1000);
    });
  }

  //Redux Form's renderField() method
  renderField(field) {
    //Provide "invalid" classNames when a field is both 'touched',
    //and has 'error', which is an object returned by the validate() function.
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
    const { handleSubmit, error } = this.props;
    return (
      <div className="container">
        {//the "error" here refers to the error in the application state(store)
        error && error.status ? <ErrorPage type="login" /> : null}
        <h1>Log in</h1>
        <form
          className="col s12"
          onSubmit={handleSubmit(this.onComponentSubmit.bind(this))}
          //                      ▲ ▲ ▲ ▲ ▲ ▲ ▲
          // this.onComponentSubmit() referes to the method of this component
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
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={this.state.open}
          autoHideDuration={3000}
          onClose={this.hideAlert.bind(this)}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">Login successful!</span>}
        />
      </div>
    );
  }
}

// The 'validate' function will be called automaticalli by Redux Form
// whenever a user attempts to submit the form
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

const mapStateToProps = state => ({ error: state.error });

export default reduxForm({
  validate,
  //value of "form" must be unique
  form: "LoginForm"
})(
  connect(
    mapStateToProps,
    { userLogin }
  )(Login)
);
