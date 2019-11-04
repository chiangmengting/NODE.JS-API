// 引入套件
const express = require('express')  //EXPRESS(建立路由使用)
const bodyParser = require('body-Parser'); //將body-parser設成頂層middleware,放在所有路由前(包含urlencoded和json這兩種解析功能)
const cors = require('cors'); //CORS(解決跨網域問題)
const bluebird = require('bluebird'); //青鳥
const _ = require("lodash"); //loadsh,處理數據的各種方法
const test = require('./test'); //如何和自己的api連接的測試

const mysql = require('mysql');
// 設定資料庫連線
const db = mysql.createConnection({
    host: 'localhost',
    user: 'Nana',
    password: 'addme',
    database: 'pbook',
});
db.connect(); //資料庫連線

bluebird.promisifyAll(db);

const app = express() //EXPRESS

const urlEncodeParser = bodyParser.urlencoded({ extend: false }); //middleware(只有用post方法才會經過這個middleware)


app.use(urlEncodeParser); //將middleware設置為頂層,這樣下面的post方法就不需要每個都加這個常數(只有用post方法才會經過這個middleware) >解析urlencoded
app.use(bodyParser.json()); //將middleware設置為頂層,這樣下面的post方法就不需要每個都加這個常數(只有用post方法才會經過這個middleware)>解析JSON


//app.use(cors()); //預設的 Access-Control-Allow-Origin 是 * (代表全部瀏覽器都可以查看資料)
//設定指定的瀏覽器才能連線
const whitelist = ['http://localhost:3000', undefined]; //若要使用同一台伺服器需使用undefined而不是直接填url(node.js設定問題)
const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        console.log('origin: ' + origin);
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('錯誤囉!!!請更換到白名單內有的port號!!!'));
        }
    }
}
app.use(cors(corsOptions));


// // 預設首頁
app.get('/', function (req, res) {
    res.send('API首頁')
})

//如何和自己的api連接的測試
app.get('/test', function (req, res) {
    res.json(test)
})

// 自定義錯誤頁面
app.use((req, res) => {
    res.type('text/plain')
    res.status(404)
    res.send('404-找不到此API')
})


app.listen(5555, function () {
    console.log('啟動server 偵聽PORT 5555');
})
