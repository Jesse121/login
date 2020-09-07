/*
 * @Date: 2020-09-03 19:34:05
 * @LastEditors: yangdong
 * @LastEditTime: 2020-09-04 15:41:05
 */
//model/user.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//定义数据类型
const userSchema = new Schema({
	name: {
		type: String,
		require: true
	},
	email: {
		type: String,
		require: true
	},
	password: {
		type: String,
		require: true
	},
	isAdmin: {
		type: Boolean, //是否是管理员
		default: false //默认false 管理员身份修改数据库即可
	},
	date: {
		type: Date,
		default: Date
	}
});
//基于数据结构创建一个叫User的表(首字母大写) 数据库中自动生成叫users
module.exports = mongoose.model("User", userSchema);
