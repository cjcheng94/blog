import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Alert from "react-s-alert";

import ErrorPage from "../components/errorPage";
import { createPost } from "../actions/posts";

class PostNew extends Component {
  showAlert(message) {
    Alert.info(message, {
      position: "top-right",
      effect: "slide",
      timeout: 2000,
      offset: "50px"
    });
  }

  //Redux Form's renderField() method
  renderField(field) {
    //Provide "invalid" classNames when a field is both 'touched',
    //and has 'error', which is an object returned by the validate() function.
    const {
      input: { name },
      meta: { touched, error }
    } = field;
    const className = `${touched && error ? "invalid" : ""}`;
    const txtAreaClassName = `materialize-textarea ${className}`;

    if (name === "content") {
      return (
        <div className="input-field col s12" id="contentDiv">
          <textarea
            className={txtAreaClassName}
            id={name}
            type="text"
            {...field.input}
          />
          <label htmlFor={name}>{name}</label>
          <span className="helper-text red-text">{touched ? error : ""}</span>
        </div>
      );
    }
    return (
      <div className="input-field col s6">
        <input className={className} id={name} type="text" {...field.input} />
        <label htmlFor={name}>{name}</label>
        <span className="helper-text red-text">{touched ? error : ""}</span>
      </div>
    );
  }

  onComponentSubmit(values) {
    this.props.createPost(values, () => {
      this.showAlert("Post Successfully Added!");
      setTimeout(() => {
        this.props.history.push("/");
      }, 1000);
    });
  }

  render() {
    // handleSubmit is from Redux Form, it handles validation etc.
    const { handleSubmit, error } = this.props;
    const isDisabled = this.props.isPending ? "disabld" : "";
    return (
      <div className="container">
        {
          //error here refers to state error
          error && error.status ? <ErrorPage type="postNew" /> : null}
        <form
          onSubmit={handleSubmit(this.onComponentSubmit.bind(this))}
          //                     ▲ ▲ ▲ ▲ ▲ ▲ ▲
          // this.onComponentSubmit() referes to the method of this component
          className="col s12"
        >
          <div className="row">
            <Field name="title" component={this.renderField} />
          </div>
          <div className="row">
            <Field name="content" component={this.renderField} />
          </div>
          <div className=" col s12">
            <button
              className={`btn waves-effect waves-light from-btn cyan darken-1 ${isDisabled}`}
              type="submit"
            >
              Submit
            </button>
            <Link
              className="btn waves-effect waves-light red lighten-1 from-btn"
              to="/"
            >
              Back
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

// The 'validate' function will be called automaticalli by Redux Form
// whenever a user attempts to submit the form
function validate(values) {
  const errors = {};
  // Validate the inputs from 'values'
  if (!values.title) {
    errors.title = "Please enter a title";
  }
  if (!values.content) {
    errors.content = "Please enter some content";
  }
  //if the "errors" object is empty, the form is valid and ok to submit
  return errors;
}

const mapStateToProps = ({ posts: { isPending }, error }) => ({
  isPending,
  error
});

export default reduxForm({
  validate,
  //value of "form" must be unique
  form: "PostsNewForm"
})(
  connect(
    mapStateToProps,
    { createPost }
  )(PostNew)
);
