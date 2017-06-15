var express=require('express');
var bodyParser=require('body-parser');
var app=express();
var mysql=require('mysql');

app.use(express.static('/public')); //在public文件夹新建index.html静态文件
app.use(bodyParser.urlencoded()); //请求体中间件

//跨域请求设置
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post('/check/:item', function(req, res) {
	// res.send(req.body);
	// res.send(req.params.item);

	function toTwo(n) { return n<10? "0"+n: ""+n; } //补全时间上的两位数

	var year=new Date().getFullYear(),
		month=new Date().getMonth()+1,
		date=new Date().getDate(),
		hour=new Date().getHours(),
		min=new Date().getMinutes(),
		second=new Date().getSeconds();
	var timeStr=`${toTwo(year)}年${toTwo(month)}月${toTwo(date)}日 ${toTwo(hour)}:${toTwo(min)}:${toTwo(second)}`;

	var connection=mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '20402991GnAt',
		database: 'mymessage',
		port: 3306
	});
	connection.connect();
	connection.query('set names utf8');

	if (req.params.item=="user") { //登录用户名存在性和注册用户名重复性验证
		var user=req.body.username;
		
		var select=`SELECT * FROM user_info WHERE username='${user}'`; 
		
		connection.query(select, function(err, rows, fields) {
			if (err) {
				throw err;
				return;
			} else if (!rows.length) {
				// console.log(rows); //数组。从数据库中拿出的数据，每条数据是一个json
				// console.log(fields); //数组。该条数据中的每个字段的详细信息介绍
				res.send("0"); //登录用户名不存在
			} else {
				res.send("1"); //注册用户名重复
			}
		});
		connection.end();

	} else if (req.params.item=="loginsubmit") {
		var user=req.body.username;
		var pwd=req.body.password;
 
		var select=`SELECT * FROM user_info WHERE username='${user}' AND password='${pwd}'`; 
		
		connection.query(select, function(err, rows, fields) {

			// console.log(rows[0].id); //这个地方要注意！
			
			if (err) {
				throw err;
				return;
			} else if (!rows.length) {
				// console.log(rows); //json。数据库中的该条数据
				// console.log(fields); //数组。该条数据中的每个字段的详细信息介绍
				res.send("0"); //对应前台密码错误
			} else if (rows[0].id==1) {
				// res.send("1");
				var update=`UPDATE user_info SET last_time='${timeStr}' WHERE id='1'`;
				connection.query(update, function(err, rows, fields) {
					if (err) {
						throw err;
						return;
					} else {
						res.send("1"); //对应前台欢迎管理员
					}
				})
				connection.end();
			} else if (rows[0].id!=1) {
				var update=`UPDATE user_info SET last_time='${timeStr}' WHERE id='${rows[0].id}'`;
				connection.query(update, function(err, rows, fields) {
					if (err) {
						throw err;
						return;
					} else {
						res.send("2"); //对应前台非管理员欢迎登录
					}
				})
				connection.end();
			}
		});

	} else if (req.params.item=="registsubmit") {
		var user=req.body.username;
		var pwd=req.body.password;
		
		var insert=`INSERT INTO user_info VALUES(NULL,'${user}','${pwd}','${timeStr}')`; 
		
		connection.query(insert, function(err, rows, fields) {
			if (err) {
				throw err;
				return;
			} else {
				// console.log(rows); //json。数据库中的该条数据
				// console.log(fields); //数组。该条数据中的每个字段的详细信息介绍
				res.send("1"); // 注册
			} 
		});
		connection.end();
	}
})

app.post('/mes/:item', function(req, res) {

	function toTwo(n) { return n<10? "0"+n: ""+n; }

	var year=new Date().getFullYear(),
		month=new Date().getMonth()+1,
		date=new Date().getDate(),
		hour=new Date().getHours(),
		min=new Date().getMinutes(),
		second=new Date().getSeconds();
	var timeStr=`${toTwo(year)}年${toTwo(month)}月${toTwo(date)}日 ${toTwo(hour)}:${toTwo(min)}:${toTwo(second)}`;


	var connection=mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '20402991GnAt',
		database: 'mymessage',
		port: 3306
	});
	connection.connect();
	connection.query('set names utf8');

	if (req.params.item=="getmes") { //前台componentDidMount获取数据
		var select=`SELECT * FROM message ORDER BY id DESC`;

		connection.query(select, function(err, rows, fields) {
			if (err) {
				throw err;
				return;
			} else {
				res.send(rows);
			}
		})
		connection.end();

	} else if (req.params.item=="insertmes") { //前台点击留言写入数据库
		var user=req.body.username;
		var pwd=req.body.message;
		var time=req.body.time;

		var insert=`INSERT INTO message(username,password,content,addate) VALUES('${user}','default','${pwd}','${time}')`;
		connection.query(insert, function(err, rows, fields) {
			if (err) {
				throw err;
				return; 
			} else {
				// res.send("9");
				var select=`SELECT * FROM message ORDER BY id DESC`; 
				connection.query(select, function(err, rows, fields) {  //新的留言写入数据库后，再将所有留言发送前台，更新mesList的state
					if (err) {
						throw err;
						return;
					} else {
						res.send(rows); 
					} 
				});
				connection.end();
			}
		})

	} else if (req.params.item=="delmes") {
		var id=req.body.id;

		var del=`DELETE FROM message WHERE id='${id}'`;
		connection.query(del, function(err, rows, fields) {  //删除数据库中指定id的留言
			if (err) {
				throw err;
				return;
			} else {
				// console.log("删除成功！");
				var select=`SELECT * FROM message ORDER BY id DESC`; 
				connection.query(select, function(err, rows, fields) {  //删除指定id的留言后，再将所有留言发送前台，更新mesList的state
					if (err) {
						throw err;
						return;
					} else {
						// console.log(rows);
						res.send(rows); 
					} 
				});
				connection.end();
			} 
		});

	} else if (req.params.item=="eva") {
		var id=req.body.id;
		var flag=req.body.flag;
		var evaNum=req.body.evaNum;
		
		var eva=flag? "zan":"cai";
			
		var update=`UPDATE message SET ${eva}='${evaNum}' WHERE id='${id}'`;
		connection.query(update, function(err, rows, fields) {
			if (err) {
				throw err;
				return;
			} else {
				var select=`SELECT * FROM message ORDER BY id DESC`; 
				connection.query(select, function(err, rows, fields) {  //更新赞或者踩后，再将所有留言发送前台，更新mesList的state
					if (err) {
						throw err;
						return;
					} else {
						res.send(rows); 
					} 
				});
				connection.end();
			}
		})
	}
})	

app.listen(3000, function() {
	console.log('listen on port 3000');
})
