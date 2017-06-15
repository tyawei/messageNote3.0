import React from 'react';
import ReactDOM from 'react-dom';
import {Link, IndexLink} from 'react-router';

import handleCookie from '../components/cookie.js';

class Nav extends React.Component {
	constructor(props) {
		super(props);
		this.registClick=this.registClick.bind(this);
		this.loginClick=this.loginClick.bind(this);
	}
	registClick(e) {
		let user=handleCookie.getCookie("user");
		if (user) {
			e.preventDefault();
			handleCookie.clearCookie("user", -1);
			this.context.router.push("/");
		} 
	}
	loginClick(e) {
		let user=handleCookie.getCookie("user");
		if (user) {
			e.preventDefault();
			this.context.router.push("/user_info");
		}
	}

	render() {
		let user=handleCookie.getCookie("user");
		let login=user? "/user_info":"/login";
		let regist=user? "/":"/regist";
		return (
			<div>
				<header id="h">
					<nav className="nav-bar">
						<IndexLink activeClassName="active" className="links" to="/">首页</IndexLink>
						<Link activeClassName="active" className="links" to={login} onClick={this.loginClick}>{user? user:"登录" }</Link>
						<Link activeClassName="active" className="links" to={regist} onClick={this.registClick}>{user? "退出":"注册"}</Link>
					</nav>
				</header>
				{this.props.children}
			</div>
		)
	}
}
Nav.contextTypes={
	router: React.PropTypes.object.isRequired
}

export default Nav;