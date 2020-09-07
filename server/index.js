/*
 * @Date: 2020-09-03 19:09:17
 * @LastEditors: yangdong
 * @LastEditTime: 2020-09-07 11:30:12
 */
const koa = require("koa");
const app = new koa();
const router = require("./routers/user");
//引入json
// const json = require("koa-json");
//解析post请求
const bodyParser = require("koa-bodyparser");
//引入mongoose数据库
const mongoose = require("mongoose");
//配置静态图片 否则koa-multer上传图片后在浏览器无法查看图片
const staticFiles = require("koa-static");
const path = require("path");
const { sign } = require("jsonwebtoken");
const secret = "demo";
const jwt = require("koa-jwt")({ secret });

//中间件
// app.use(json());
app.use(bodyParser());
//注意 访问时不需要增加/public前缀
app.use(staticFiles(path.join(__dirname, "./dist")));

//封装接口
router(app);

//连接数据库 数据库名webstack
mongoose
	.connect("mongodb://localhost:27017/webstack", { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("数据库连接成功");
		//监听端口
		app.listen(3000, () => {
			console.log("服务端已开启: http://localhost:3000");
		});
	})
	.catch(() => {
		console.log("数据库连接失败");
	});
