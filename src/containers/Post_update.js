import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Alert from "react-s-alert";

import { updatePost, fetchPost } from "../actions";
import Modal from "../components/modal";

class PostUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
    this.handleModalShow = this.handleModalShow.bind(this);
    this.handleModalHide = this.handleModalHide.bind(this);
  }
  componentDidMount() {
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
    Alert.success(message, {
      position: "top-right",
      effect: "slide",
      timeout: 2000
    });
  }
  renderField(field) {
    const {
      meta: { touched, error }
    } = field;
    //-> touched = field.meta.touched
    //-> error = field.meta.error
    const className = `${touched && error ? "invalid" : ""}`;
    const txtAreaClassName = `materialize-textarea edit-textarea ${className}`;
    const { name } = field.input;
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
  onSubmit(values) {
    const { _id } = this.props.match.params;

    const requestBody = Object.keys(values)
      .filter(key => key === "title" || key === "content")
      .map(e => ({ propName: e, value: values[e] }));

    this.props.updatePost(_id, requestBody, () => {
      this.showAlert("Post Successfully Updated!");
      setTimeout(() => this.props.history.push("/"), 1500);
    });
  }
  render() {
    if (!this.props.post) {
      return (
        <div className="progress">
          <div className="indeterminate" />
        </div>
      );
    }
    // handleSubmit is from Redux Form, it handles validation etc.
    const { handleSubmit } = this.props;
    return (
      <div className="row">
        <form
          onSubmit={handleSubmit(this.onSubmit.bind(this))}
          //                     ▲ ▲ ▲ ▲ ▲ ▲ ▲
          // this.onSubmit() referes to the onSubmit() method of this component,
          // it handles the submission of the form
          className="col s12"
        >
          {this.state.showModal ? (
            <Modal
              message="Submit changes?"
              handleModalHide={this.handleModalHide.bind(this)}
              buttonType="submit"
            />
          ) : null}
          <div className="row">
            <Field name="title" component={this.renderField} />
            <Field name="content" component={this.renderField} />
            <div className=" col s12">
              <button
                className="btn waves-effect waves-light from-btn cyan darken-1"
                onClick={this.handleModalShow}
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

function mapStateToProps({ posts }, ownProps) {
  return {
    post: posts[ownProps.match.params._id],
    initialValues: posts[ownProps.match.params._id]
  };
}

PostUpdate = reduxForm({
  form: "PostEditForm",
  validate
})(PostUpdate);

PostUpdate = connect(
  mapStateToProps,
  { fetchPost, updatePost }
)(PostUpdate);
export default PostUpdate;
