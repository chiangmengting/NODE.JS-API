// 引入套件
const express = require("express"); //EXPRESS(建立路由使用)
const bodyParser = require("body-Parser"); //將body-parser設成頂層middleware,放在所有路由前(包含urlencoded和json這兩種解析功能)
const cors = require("cors"); //CORS(解決跨網域問題)
const bluebird = require("bluebird"); //青鳥
const session = require("express-session");
const _ = require("lodash"); //loadsh,處理數據的各種方法
const test = require("./api/test"); //如何和自己的api連接的測試

const mysql = require("mysql");
// 設定資料庫連線
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "pbook"
});
db.connect(); //資料庫連線

bluebird.promisifyAll(db);

const app = express(); //EXPRESS

const urlEncodeParser = bodyParser.urlencoded({ extend: false }); //middleware(只有用post方法才會經過這個middleware)

app.use(urlEncodeParser); //將middleware設置為頂層,這樣下面的post方法就不需要每個都加這個常數(只有用post方法才會經過這個middleware) >解析urlencoded
app.use(bodyParser.json()); //將middleware設置為頂層,這樣下面的post方法就不需要每個都加這個常數(只有用post方法才會經過這個middleware)>解析JSON

//app.use(cors()); //預設的 Access-Control-Allow-Origin 是 * (代表全部瀏覽器都可以查看資料)
//設定指定的瀏覽器才能連線
const whitelist = ["http://localhost:3000", undefined]; //若要使用同一台伺服器需使用undefined而不是直接填url(node.js設定問題)
const corsOptions = {
  credentials: true,
  origin: function(origin, callback) {
    console.log("origin: " + origin);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("錯誤囉!!!請更換到白名單內有的port號!!!"));
    }
  }
};
app.use(cors(corsOptions));

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




// // 預設首頁
app.get("/", function(req, res) {
  res.send("API首頁");
});

// nana的聊天室使用(chatList,最新且不重複)
var mapResult = [];
app.get("/chatList", function(req, res) {
  req.session.memberId = "MR00001";
  if (req.session.memberId === undefined) {
    res.json(test);
  }
  db.queryAsync(
    `SELECT mb_chat.*,MR_number,MR_name,MR_pic FROM mb_chat LEFT JOIN mr_information ON MR_number = myTo OR MR_number = myFrom WHERE myFrom = "${req.session.memberId}" OR myTo = "${req.session.memberId}" ORDER BY created_at ASC`
  )
    .then(results => {
      // 一開始拿的資料,MR_number有塞我的跟對方的,為了讓MR_number是塞對方的資料,所以要先篩選一次
      var Without_MY_MR_number = [];
      results.forEach(function(value, index) {
        if (value.MR_number !== req.session.memberId) {
          Without_MY_MR_number.push(value);
        }
      });
      // 去除重複的chat_id(因為同樣的兩位只需開一個對話框)
      var myResult = {};
      var finalResult = [];
      for (var i = 0; i < Without_MY_MR_number.length; i++) {
        myResult[Without_MY_MR_number[i].chat_id] = Without_MY_MR_number[i];
        //Without_MY_MR_number[i].chat_id不能重复,達到去重效果,這裡必須知道"chat_id"或是其他键名
      }
      //现在result内部都是不重复的对象了，只需要将其键值取出来转为数组即可
      for (item in myResult) {
        finalResult.push(myResult[item]);
      }

      mapResult = finalResult;

      return db.queryAsync(
        `SELECT * FROM mb_chat WHERE myTo = "${req.session.memberId}" AND myRead = 0`
      );
    })
    .then(results => {
      mapResult.forEach(function(value, index) {
        value.total = 0;
        for (var i = 0; i < results.length; i++) {
          if (value.MR_number === results[i].myFrom) {
            value.total++;
          }
        }
      });

      res.json(mapResult);
    })
    .catch(error => {
      res.send("404-找不到資料");
      console.log(error);
    });
});

app.get("/ChatMessage", function(req, res) {
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

//如何和自己的api連接的測試
app.get("/test", function(req, res) {
  res.json(test);
});

// 自定義錯誤頁面
app.use((req, res) => {
  res.type("text/plain");
  res.status(404);
  res.send("404-找不到此API");
});

app.listen(5555, function() {
  console.log("啟動server 偵聽PORT 5555");
});
