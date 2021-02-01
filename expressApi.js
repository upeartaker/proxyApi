var express = require('express');
var bodyParser = require('body-parser');//body-parser中间件来解析请求体
var http = require('http')
var app = express();
var port = 2000;
//定义一个爬虫，去爬取远端api
function spider (callback,postData) {
	var post_data = JSON.stringify(postData)
	const option = {
		hostname:'www.xxx.xxx',
		port:80,
		path:'/api/a/system_sms/send.json',
		headers:{
			"Content-Type":'application/json',
		},
		method:'POST'
	}

	var req = http.request(option,(res)=>{
		var allData = '';
		res.on("data",(chunk)=>{
			allData+=chunk
		})
		res.on("end",()=>{
			callback(allData)
		})
	})

	req.write(post_data)
	req.end()
}

//定义同源协议CORS
var allowCrossDomain = function (req, res, next) {
 res.header('Access-Control-Allow-Origin', '*');
 res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
 res.header('Access-Control-Allow-Headers', 'Content-Type');
 res.header('Access-Control-Allow-Credentials','true');
 next();
};

app.use(allowCrossDomain);//运用跨域的中间件
app.use(bodyParser.text());//运用中间件，对请求体的文本进行解析
// app.use(bodyParser.json());
app.get('/api', function (req, res, next) {
  console.log(req.query);//打印出请求体的信息
  spider(data=>{
			res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'})
			res.write(data);
			res.end()
		},req.query)
});
app.listen(port,function(){
	console.log('启动成功')
});
