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

import ErrorPage from "../components/errorPage";
import { createPost } from "../actions/posts";


const styles = {
  formNew: {
    maxWidth: 1000,
    margin: '0px auto'
  },
  button: {
    marginTop: 20,
    marginRight: 20
  }
}
class PostNew extends Component {
  state = {
    open: false
  };
  showAlert() {
    this.setState({ open: true });
  }
  hideAlert() {
    this.setState({ open: false });
  }

  //For Redux Form's Field Component
  renderField(field) {
    //Set the TextField(from Material-UI)'s erorr prop to true when a field is both 'touched',
    //and has 'error', which is an object returned by the validate() function.
    const {
      input: { name },
      meta: { touched, error }
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
    this.props.createPost(values, () => {
      this.showAlert();
      setTimeout(() => {
        this.props.history.push("/");
      }, 1000);
    });
  }

  render() {
    // handleSubmit is from Redux Form, it handles validation etc.
    const { handleSubmit, error, classes } = this.props;

    return (
      <Fragment>
        {//error here refers to state error
        error && error.status ? <ErrorPage type="postNew" /> : null}
        <Typography
          variant='headline'
          gutterBottom
          align='center'
        >
          Write Your Story
        </Typography>
        <form
          className={classes.formNew}
          onSubmit={handleSubmit(this.onComponentSubmit.bind(this))}
          //                     ▲ ▲ ▲ ▲ ▲ ▲ ▲
          // this.onComponentSubmit() referes to the method of this component
        >
          <Field name="title" component={this.renderField} />
          <Field name="content" component={this.renderField} />
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            type="submit"
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
          open={this.state.open}
          autoHideDuration={4000}
          onClose={this.hideAlert.bind(this)}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">Create new post successfull!</span>}
        />
      </Fragment>
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

const mapStateToProps = ({ isPending, error }) => ({
  isPending,
  error
});

export default compose(
  withStyles(styles, {
    name: "PostNew"
  }),
  reduxForm({
    validate,
    //value of "form" must be unique
    form: "PostsNewForm"
  }),
  connect(
    mapStateToProps,
    { createPost }
  )
)(PostNew);
