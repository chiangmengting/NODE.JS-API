import express from "express";
import bodyparser from "body-parser";
import cors from "cors";

const app = express();
const mysql = require("mysql");
const db = mysql.createConnection({
  host: "192.168.27.186",
  user: "root",
  password: "root",
  database: "pbook"
});
db.connect();

const bluebird = require("bluebird");
bluebird.promisifyAll(db);

app.use(cors()); //預設的 Access-Control-Allow-Origin 是 * (代表全部瀏覽器都可以查看資料)
//設定指定的瀏覽器才能連線
const whitelist = ["http://localhost:3000", undefined]; //若要使用同一台伺服器需使用undefined而不是直接填url(node.js設定問題)
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    console.log("origin: " + origin);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("錯誤囉!!!請更換到白名單內有的port號!!!"));
    }
  }
};
app.use(cors(corsOptions));

const session = require("express-session");
// 設定session的middleware
app.use(
  session({
    //新用戶沒有使用到session物件時不會建立session和發送cookie
    saveUninitialized: false,
    resave: false,
    secret: "yoko0509",
    cookie: {
      maxAge: 1200000 //單位毫秒
    }
  })
);


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static("public"));


app.use("/member", require('./src/member/member'))
app.use("/forum", require("./src/forum/homepage"));
app.use("/nana_use", require("./src/nana_use/chatList"));
app.use("/nana_use", require("./src/nana_use/chatMessage"));
app.use("/books", require(__dirname + '/src/books/book_categories') )
app.use('/activities', require('./src/activities/acApi'))


app.get("/", function (req, res) {
  res.send("Home");
});


//if we are here then the specified request is not found
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});


//all other requests are not implemented.
app.use((err, req, res, next) => {
  res.status(err.status || 501);
  res.json({
    error: {
      code: err.status || 501,
      message: err.message
    }
  });
});

module.exports = app;
