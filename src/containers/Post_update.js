import React, { Component, Fragment } from "react";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";

import Snackbar from "@material-ui/core/Snackbar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core";

import Modal from "../components/modal";
import ErrorPage from "../components/errorPage";
import { updatePost, fetchPost } from "../actions/posts";

const styles = {
  formEdit: {
    maxWidth: 1000,
    margin: "0px auto"
  },
  button: {
    marginTop: 20,
    marginRight: 20
  }
};

class PostUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showAlert: false
    };
  }
  showAlert() {
    this.setState({ showAlert: true });
  }
  hideAlert() {
    this.setState({ showAlert: false });
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

  //For Redux Form's Field Component
  renderField(field) {
    //Set the TextField(from Material-UI)'s erorr prop to true when a field is both 'touched',
    //and has 'error', which is an object returned by the validate() function.
    const {
      meta: { touched, error },
      input: { name }
    } = field;
    if (name === "content") {
      return (
        <TextField
          label={name}
          helperText={touched ? error : ""}
          error={!!(touched && error)}
          multiline
          rows="4"
          rowsMax="900"
          margin="normal"
          type="text"
          variant="outlined"
          fullWidth
          {...field.input}
        />
      );
    }
    return (
      <TextField
        label={name}
        helperText={touched ? error : ""}
        error={!!(touched && error)}
        margin="normal"
        type="text"
        variant="outlined"
        fullWidth
        {...field.input}
      />
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
      this.showAlert();
      setTimeout(() => {
        this.props.history.push("/");
      }, 1000);
    });
  }
  render() {
    // handleSubmit is from Redux Form, it handles validation etc.
    const { handleSubmit, stateError, classes } = this.props;
    return (
      <Fragment>
        <form
          className={classes.formEdit}
          onSubmit={handleSubmit(this.onComponentSubmit.bind(this))}
          //                     ▲ ▲ ▲ ▲ ▲ ▲ ▲
          // this.onComponentSubmit() referes to the method of this component
        >
          <Typography variant="headline" gutterBottom align="center">
            Edit Your Story
          </Typography>
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

          <Field name="title" component={this.renderField} />
          <Field name="content" component={this.renderField} />
          <Button
            className={classes.button}
            onClick={this.handleModalShow.bind(this)}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            color="secondary"
            component={Link}
            to="/"
          >
            Back
          </Button>
        </form>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={this.state.showAlert}
          autoHideDuration={3000}
          onClose={this.hideAlert.bind(this)}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">Update successful!</span>}
        />
      </Fragment>
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
export default compose(
  withStyles(styles, {
    name: "PostUpdate"
  }),
  connect(
    mapStateToProps,
    { fetchPost, updatePost }
  ),
  reduxForm({
    validate,
    form: "PostEditForm"
  })
)(PostUpdate);
