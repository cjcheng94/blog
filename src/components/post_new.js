import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Alert from "react-s-alert";

import { createPost } from "../actions";

class PostNew extends Component {
	showAlert(message) {
		Alert.success(message, {
			position: "top-right",
			effect: "slide",
			timeout: 2000
		});
	}

	renderField(field) {
		const { meta: { touched, error } } = field;
		//-> touched = field.meta.touched
		//-> error = field.meta.error
		const className = `${touched && error ? "invalid" : ""}`;
		const txtAreaClassName = `materialize-textarea ${className}`;

		if (field.input.name === "content") {
			return (
				<div className="input-field col s12" id="contentDiv">
					<textarea
						className={txtAreaClassName}
						id={field.input.name}
						type="text"
						{...field.input}
					/>
					<label htmlFor={field.input.name}>{field.input.name}</label>
					<span className="helper-text red-text">{touched ? error : ""}</span>
				</div>
			);
		}
		return (
			<div className="input-field col s6">
				<input
					className={className}
					id={field.input.name}
					type="text"
					{...field.input}
				/>
				<label htmlFor={field.input.name}>{field.input.name}</label>
				<span className="helper-text red-text">{touched ? error : ""}</span>
			</div>
		);
	}

	onSubmit(values) {
		this.props.createPost(values, () => {
			this.showAlert("Post Successfully Added!");
			setTimeout(()=>this.props.history.push('/'),1000);
		});
	}

	render() {
		// handleSubmit is from Redux Form, it handles validation etc.
		const { handleSubmit } = this.props;
		return (
			<div className="row">
				<form
					onSubmit={handleSubmit(this.onSubmit.bind(this))}
					//                     ▲ ▲ ▲ ▲ ▲ ▲ ▲
					// this.onSubmit() referes to line 35 - , it handles the submission of the form
					className="col s12"
				>
					<div className="row">
						<Field name="title" component={this.renderField} />
						<Field name="author" component={this.renderField} />
						<Field name="content" component={this.renderField} />
						<div className=" col s12">
							<button
								className="btn waves-effect waves-light from-btn cyan darken-1"
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
	if (!values.author) {
		errors.author = "Please enter an author";
	}
	if (!values.content) {
		errors.content = "Please enter some content";
	}
	//if the "errors" object is empty, the form is valid and ok to submit
	return errors;
}

export default reduxForm({
	validate, // -> validate: validate
	form: "PostsNewForm"
	//value of "form" must be unique
})(connect(null, { createPost })(PostNew));
