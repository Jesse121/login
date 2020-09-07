/*
 * @Date: 2020-09-03 19:35:26
 * @LastEditors: yangdong
 * @LastEditTime: 2020-09-07 14:24:31
 */
//routers/user.js
const KoaRouter = require("koa-router");
const rootRouter = new KoaRouter();
const childRouter = new KoaRouter();
//引入users数据表
const User = require("../model/User");

const { sign } = require("jsonwebtoken");
const secret = "demo";
const jwt = require("koa-jwt")({ secret });

module.exports = app => {
	/**
	 * @route POST api/users/login
	 * @desc 登录接口地址 返回token
	 * @access 接口是公开的 即不需要token
	 */
	childRouter.post("/login", async ctx => {
		//接收参数 post
		// console.log(ctx.request.body);
		const findResult = await User.find({
			name: ctx.request.body.name
		});
		// console.log(findResult);
		if (findResult.length == 0) {
			ctx.status = 404;
			ctx.body = {
				status: 404,
				message: "用户不存在"
			};
		} else {
			//验证密码是否正确
			var result = await User.find({ password: ctx.request.body.password });
			let name = ctx.request.body.name;
			const token = sign({ name }, secret, { expiresIn: "1m" });
			if (result.length > 0) {
				//返回用户信息
				ctx.status = 200;
				ctx.body = {
					status: 200,
					message: "登录成功",
					token
					// userInfo: findResult[0]
				};
			} else {
				ctx.status = 400;
				ctx.body = {
					status: 400,
					message: "密码错误"
				};
			}
		}
	});

	/**
	 * @route POST api/users/register
	 * @desc 注册接口地址
	 * @access 接口是公开的 即不需要token
	 */
	childRouter.post("/register", async ctx => {
		//接收参数 post
		console.log(ctx.request.body);
		const findResult = await User.find({
			email: ctx.request.body.email
		});
		console.log(findResult);
		//判断是否存在该用户
		if (findResult.length > 0) {
			//状态码
			ctx.status = 400;
			ctx.body = {
				status: 400,
				message: "邮箱已经被占用"
			};
		} else {
			//存储到数据库
			const newUser = new User({
				password: ctx.request.body.password,
				name: ctx.request.body.name,
				email: ctx.request.body.email
			});
			//返回给客户端 一定要await 否则会返回Not Found
			await newUser
				.save()
				.then(user => {
					// console.log(user);
					ctx.status = 200;
					ctx.body = {
						status: 200,
						message: "注册成功",
						userInfo: user
					};
				})
				.catch(err => {
					console.log(err);
				});
		}
	});

	childRouter.get("/test", jwt, async (ctx, next) => {
		ctx.body = { foo: "bar" };
	});
	// 路由分层
	rootRouter.use("/api", childRouter.routes(), childRouter.allowedMethods());
	//配置路由模块
	app.use(rootRouter.routes()).use(rootRouter.allowedMethods());
};
