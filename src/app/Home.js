import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';
import $ from 'jquery';

import handleCookie from '../components/cookie.js';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange=this.handleChange.bind(this);
		this.handleClick=this.handleClick.bind(this);
		this.handleDel=this.handleDel.bind(this);
		this.handleEva=this.handleEva.bind(this);
		this.state={
			value: "",
			username: "",
			time: "",
			mesList: "",
			isAdmin: false
		}
	} 
	handleChange(val) {
		this.setState({
			value: val
		})
	}
	handleClick() {
		let {value}=this.state;
		let user=handleCookie.getCookie("user");
		if (!user) {
			alert("请先登录或注册");
			return;
		} else if (!value) {
			alert("留言不能为空");
			return;
		}

		let year=new Date().getFullYear(),
			month=new Date().getMonth()+1,
			date=new Date().getDate(),
			hour=new Date().getHours(),
			min=new Date().getMinutes(),
			second=new Date().getSeconds();
		let timeStr=`${toTwo(year)}年${toTwo(month)}月${toTwo(date)}日 ${toTwo(hour)}:${toTwo(min)}:${toTwo(second)}`;
		this.setState({
			value: ""  //点击后让textarea里面的内容为空
		})
		
		$.ajax({
			type: "POST", 
			url: "mes/insertmes",
			data: {
				username: user,
				message: value,
				time: timeStr
			},
			success: (data)=>{
				this.setState({
					mesList:data
				})
			}, 
			error: (xhr)=>{
				alert("留言请求出错"+xhr.status);
			}
		})

		function toTwo(n) {return n<10? "0"+n:""+n;}
	}
	handleDel(e) {
		var id=e.target.parentNode.getAttribute("name");
		$.ajax({
			type: 'POST',
			url: 'mes/delmes',
			data: {
				id: id
			},
			success: (data)=>{
				this.setState({
					mesList: data
				})
			},
			error: (xhr)=>{
				alert("删除失败："+xhr.status);
			}
		})
	}
	handleEva(e) {
		let user=handleCookie.getCookie("user");
		let id, flag, evaNum;

		if (!user) {
			alert("请先登录或注册");
			return;
		}

		if (e.target.className==="good") { //之所以取className，因为要避免点击到其他地方而取不到正确的id和evaNum！
			id=e.target.parentNode.parentNode.getAttribute("name");
			flag=1; //给后台作为区分赞还是踩的变量
			evaNum=parseInt(e.target.children[0].innerHTML);
		} else if (e.target.className==="bad") {
			id=e.target.parentNode.parentNode.getAttribute("name");
			flag="";
			evaNum=parseInt(e.target.children[0].innerHTML);
		} else {
			return; //避免点击到非good和bad的其他地方，使得id和evaNum是undefined，那就尴尬了！
		}
		// console.log(id, evaNum);
		evaNum++; 
		$.ajax({
			type: 'POST', 
			url: 'mes/eva',
			data: {
				id: id,
				flag: flag,
				evaNum: evaNum
			}, 
			success: (data)=>{
				this.setState({
					mesList: data
				})
			},
			error: (xhr)=>{
				alert("评价失败："+xhr.status);
			}
		})
		
	}
	componentDidMount() {
		let user=handleCookie.getCookie("user");
		if (user==="admin") {
			this.setState({
				isAdmin: true
			})
		}
		$.ajax({
			type: 'POST',
			url: 'mes/getmes',
			success: (data)=>{
				// console.log(data);
				this.setState({
					mesList: data
				})
			},
			error: (xhr)=>{
				alert("请求数据失败:"+xhr.status);
			}
		})
	}
	render() {
		let {value, username, time, mesList, isAdmin}=this.state;
		return (
			<main id="main">
				<section className="content">
					<div className="section clearfix">
						<h2 className="tips">请在下方留言</h2>
						<form className="f">
							<textarea value={value} name="text" onChange={(e)=>this.handleChange(e.target.value)} />
							<br />
							<input type="button" className="submit" value="提交" onClick={this.handleClick} />
						</form>
					</div>
				</section>
				<section className="content">
					<article className="article">
						{
							mesList? 
							mesList.map((item, index)=>{
								return (
									<div className="mes" name={item.id} key={index}>
										<strong className="user"><span>用户名：</span><span>{item.username}</span></strong>
										<span className="time">{item.addate}</span>
										{isAdmin && <span className="del" title="点击删除" onClick={this.handleDel}>&times;</span> }
										<p className="message">{item.content}</p>
										<p className="eva">
											<span className="good" onClick={this.handleEva}>赞<em>{item.zan}</em></span>
											<span className="bad" onClick={this.handleEva}>踩<em>{item.cai}</em></span>
										</p>
									</div>
								)
							}):"留言正在加载..."
						}
					</article>
				</section>
			</main>
					
				
				
		)
	}
}
Home.contextTypes={
	router: React.PropTypes.object.isRequired
}
export default Home;