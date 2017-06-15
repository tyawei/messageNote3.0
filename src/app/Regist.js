import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import LoginRegist from '../components/LoginRegist.js';

import handleCookie from '../components/cookie.js';

class Regist extends React.Component {
	constructor(props) {
		super(props);
		this.handleSubmit=this.handleSubmit.bind(this);
		this.handleChange=this.handleChange.bind(this);
		this.handleBlur=this.handleBlur.bind(this);
		this.state={
			user: {
				error: "",
				value: "",
				valid: true
			},
			pwd: {
				error: "",
				value: "",
				valid: true
			}	
		}
	} 

	handleSubmit() {
		let {user, pwd}=this.state;
		if (!user.valid || !pwd.valid || !user.value || !pwd.value) {
			alert("请修改相关信息！");
			return false;
		} else {
			//登录和注册都有一个问题：登录或者注册后，由于跳转路由都是一样，导致登录成功或者注册成功跳转后，nav上用户和退出active状态始终存在
			//解决方法：登录和注册成功后跳转的路由设置为不同？
			$.ajax({
				type: "post",
				url: "check/registsubmit", //配置过devServer中的proxy  
				// dataType: "jsonp", 
				data: {
					username: user.value,
					password: pwd.value
				},
				success: (data)=>{
					if (data==1) {
						console.log("注册成功！");
						handleCookie.setCookie("user", user.value, 1);
						this.context.router.push("/");
					}
				},
				error: (xhr)=>{
					console.log("出错啦："+xhr.status)
				}
			});
		}
	}

	handleChange(kinds, val) {
		let Reg=/^[0-9A-Za-z]{6,20}$/g;
		let newState={error: "", value: val, valid: true};
		switch(kinds) {
			case "user": {
				if (!val.length) {
					newState.error="输入不能为空";
					newState.valid=false;
				} else if (val.length>20) {
					newState.error="用户名不得超过20位";
					newState.valid=false;
				} 
				this.setState({
					user: newState
				})
				break;
			}
			case "pwd": {
				if (!val.length) {
					newState.error="输入不能为空";
					newState.valid=false;
				} else if (!Reg.test(val)) {
					newState.error="字母数字组合6-20位";
					newState.valid=false;
				}
				this.setState({
					pwd: newState
				})
				break;
			}
		}
	}
	
	handleBlur(val) {
		let newState={error: "", value: val, valid: true};
		if (!val) return false;
		$.ajax({
			type: "post",
			url: "check/user", //配置过devServer中的proxy  
			// dataType: "jsonp", 
			data: {
				username: this.state.user.value
			},
			success: (data)=>{
				// console.log(data, $.type(data));
				if (data==1) {
					newState.error="用户名已经存在";
					newState.valid=false;
				} 
				this.setState({
					user: newState
				})
			},
			error: (xhr)=>{
				console.log("出错啦："+xhr.status)
			}
		});
	}

	render() {
		let {user, pwd}=this.state;
		return (
			<LoginRegist 
				title="请注册" 
				userError={user.error}
				pwdError={pwd.error}
				userValid={user.valid}
				pwdValid={pwd.valid}
				userValue={user.value}
				pwdValue={pwd.value}
				handleSubmit={this.handleSubmit} 
				handleChange={this.handleChange} 
				handleBlur={this.handleBlur}
			/>
		)
	}
}
Regist.contextTypes={
	router: React.PropTypes.object.isRequired
}
export default Regist;