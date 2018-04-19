import Alert from 'react-s-alert'
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import promise from "redux-promise";

import reducers from "./reducers";
import Header from "./components/Header";
import PostNew from "./components/post_new";
import PostIndex from "./components/post_index";
import PostDetails from "./components/post_details";
import PostUpdate from './components/post_update';

import 'materialize-css/dist/js/materialize.min.js';
import "materialize-css/dist/css/materialize.min.css";
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

const createStoreWithMiddleWare = applyMiddleware(promise)(createStore);
const routes = [
	{
		path: "/posts/detail/:_id",
		sidebar: Header,
		main: PostDetails
	},
	{
		path: "/posts/new",
		sidebar: Header,
		main: PostNew
	},
	{
		path: "/posts/edit/:_id",
		sidebar: Header,
		main: PostUpdate
	},
	{
		path: "/",
		exact: true,
		sidebar: Header,
		main: PostIndex
	}
];

ReactDOM.render(
	<Provider store={createStoreWithMiddleWare(reducers)}>
		<Router>
			<div className="wrapper">
				{routes.map((route, index) => (
					<Route
						key={index}
						path={route.path}
						exact={route.exact}
						component={route.sidebar}
					/>
				))}
				{routes.map((route, index) => (
					<Route
						key={index}
						path={route.path}
						exact={route.exact}
						component={route.main}
					/>
				))}
				<Alert stack={{limit: 1}} />
			</div>
		</Router>
	</Provider>,
	document.querySelector("#root")
);
