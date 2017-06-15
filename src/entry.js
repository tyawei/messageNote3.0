import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';

import '../public/style.scss';

import Nav from './app/Nav.js';
import Home from './app/Home.js';
import Login from './app/Login.js';
import Regist from './app/Regist.js';
import UserInfo from './app/UserInfo.js';

ReactDOM.render((
	<Router history={hashHistory}>
		<Route path="/" component={Nav}>
			<IndexRoute component={Home} />
			<Route path="/login" component={Login} />
			<Route path="/regist" component={Regist} />
			<Route path="/user_info" component={UserInfo} />
		</Route>
	</Router>
), document.getElementById("app"))