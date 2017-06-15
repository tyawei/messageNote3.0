import React from 'react';

import handleCookie from '../components/cookie.js';

export default class UserInfo extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let info=handleCookie.getCookie("user")+"，欢迎你！";
		return (
			<div id="main">
				<div className="content">
					<h1>{info}</h1>
				</div>
			</div>
		)
	}
}