import React from 'react';
import ReactDOM from 'react-dom';
import Form from './Form.js';

export default class LoginRegist extends React.Component {
	constructor(props) {
		super(props);
	} 
	
	render() {
		let {title, handleSubmit, handleBlur, userError, pwdError, userValid, pwdValid, userValue, pwdValue, handleChange}=this.props;
		return (
			<div id="main">
				<section className="content">
					<h2 className="tips">{title}</h2>
					{/*<form className="f">
						<label>用户名：</label>
						<input type="text" value={userValue} name="username" 
						onChange={(e)=>handleChange( "user", e.target.value)}
						onBlur={(e)=>handleBlur(e.target.value)}
						 />
						{!userValid && <span>{userError}</span>}
						<br /><br />
						<label>密码：</label>
						<input type="password" value={pwdValue} name="password" 
						onChange={(e)=>handleChange( "pwd", e.target.value)}
						 />
						{!pwdValid && <span>{pwdError}</span>}
						<br /><br />
						<input type="button" value="提交" onClick={handleSubmit} />
					</form>*/}
					<Form handleSubmit={handleSubmit} 
						  handleBlur={handleBlur} 
						  userError={userError}
						  pwdError={pwdError}
						  userValid={userValid}
						  pwdValid={pwdValid}
						  userValue={userValue}
						  pwdValue={pwdValue}
						  handleChange={handleChange}
					/>
				</section>
			</div>
		)
	}
}