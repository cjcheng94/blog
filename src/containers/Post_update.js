import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Alert from "react-s-alert";

import Modal from "../components/modal";
import ErrorPage from "../components/errorPage";
import { updatePost, fetchPost } from "../actions/posts";

class PostUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }
  componentDidMount() {
    //If all posts are already fetched, then don't waste network usage to fetch it again,
    //simply find the post by id in state
    const { _id } = this.props.match.params;
    this.props.fetchPost(_id);
  }
  handleModalShow() {
    this.setState({
      showModal: true
    });
  }
  handleModalHide() {
    this.setState({
      showModal: false
    });
  }
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
      meta: { touched, error },
      input: { name }
    } = field;
    const className = `${touched && error ? "invalid" : ""}`;
    const txtAreaClassName = `materialize-textarea edit-textarea ${className}`;
    if (name === "content") {
      return (
        <div className="input-field col s12" id="contentDiv">
          <textarea
            className={txtAreaClassName}
            id={name}
            type="text"
            {...field.input}
          />
          <label className="active" htmlFor={name}>
            {name}
          </label>
          <span className="helper-text red-text">{touched ? error : ""}</span>
        </div>
      );
    }
    return (
      <div className="input-field col s6">
        <input className={className} id={name} type="text" {...field.input} />
        <label className="active" htmlFor={name}>
          {name}
        </label>
        <span className="helper-text red-text">{touched ? error : ""}</span>
      </div>
    );
  }

  onComponentSubmit(values) {
    const { _id } = this.props.match.params;
    //Map changes into an array that looks like this:
    // [
    //   {
    //     propName: "title",
    //     value: "new title"
    //   },
    //   {
    //     propName: "content",
    //     value: "new content"
    //   }
    // ]
    const requestBody = Object.keys(values)
      .filter(key => key === "title" || key === "content")
      .map(e => ({ propName: e, value: values[e] }));

    this.props.updatePost(_id, requestBody, () => {
      this.showAlert("Post Successfully Updated!");
      this.props.history.push("/");
    });
  }
  render() {
    // handleSubmit is from Redux Form, it handles validation etc.
    const { handleSubmit, stateError } = this.props;
    return (
      <div className="container">
        <form
          onSubmit={handleSubmit(this.onComponentSubmit.bind(this))}
          //                     ▲ ▲ ▲ ▲ ▲ ▲ ▲
          // this.onComponentSubmit() referes to the method of this component
          className="col s12"
        >
          {this.state.showModal ? (
            <Modal
              message="Submit changes?"
              handleModalHide={this.handleModalHide.bind(this)}
              buttonType="submit"
              isPending={this.props.isPending}
            />
          ) : null}
          {//stateError can not be named "error" here, it will conflict with Redux Form's "error"
          stateError && stateError.status ? (
            <ErrorPage type="postUpdate" />
          ) : null}

          <div className="row">
            <Field name="title" component={this.renderField} />
          </div>
          <div className="row">
            <Field name="content" component={this.renderField} />
          </div>
          <div className=" col s12">
            <button
              className="btn waves-effect waves-light from-btn cyan darken-1"
              onClick={this.handleModalShow.bind(this)}
              type="button"
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

// The 'validate' function will be called AUTOMATICALLY by Redux Form
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

const mapStateToProps = ({ error, posts, isPending }, ownProps) => ({
  //Provide initialValues to prepopulate the form
  //See https://redux-form.com/7.4.2/examples/initializefromstate/
  initialValues: posts[ownProps.match.params._id],
  posts: posts[ownProps.match.params._id],
  isPending,
  stateError: error
});

//See https://redux-form.com/7.4.2/examples/initializefromstate/
PostUpdate = reduxForm({
  validate,
  form: "PostEditForm"
})(PostUpdate);

PostUpdate = connect(
  mapStateToProps,
  { fetchPost, updatePost }
)(PostUpdate);

export default PostUpdate;
