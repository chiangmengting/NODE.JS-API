// 引入套件
const express = require("express"); //EXPRESS(建立路由使用)
const chatMessage = express.Router();
const bluebird = require("bluebird"); //青鳥
const _ = require("lodash"); //loadsh,處理數據的各種方法


const mysql = require("mysql");
// 設定資料庫連線
const db = mysql.createConnection({
    host: "192.168.27.186",
    user: "root",
    password: "root",
    database: "pbook"
});
db.connect(); //資料庫連線

bluebird.promisifyAll(db);

chatMessage
    .route("/chatMessage")
    .get(function (req, res) {
        req.session.memberId = "MR00001";
        if (req.session.memberId === undefined) {
            res.json(test);
        }
        db.queryAsync(
            `SELECT * FROM mb_chat WHERE myFrom = "${req.session.memberId}" OR myTo = "${req.session.memberId}" ORDER BY created_at DESC`
        )
            .then(results => {
                res.json(results);
            })
            .catch(error => {
                res.send("404-找不到資料");
                console.log(error);
            });
    });
module.exports = chatMessage;







