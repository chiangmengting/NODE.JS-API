const express = require("express");
const mysql = require("mysql");
const bluebird = require("bluebird");
const router = express.Router();
const db = mysql.createConnection({
  host: "192.168.27.186",
  user: "root",
  password: "root",
  database: "pbook"
});
db.connect(error => {
  if (error) {
    return error;
  }
});
bluebird.promisifyAll(db);

router.get("/book_categories/:keyword?", (req, res) => {
  const output = {};
  // output.params = req.params; 可以在網址看params用
  let keyword = req.params.keyword || ""; //search用
  let where = " WHERE 1 ";
  if (keyword) {
    keyword = keyword.split("'").join("\\'"); // 避免 SQL injection
    where += " AND `name` LIKE '%" + keyword + "%' ";
    // output.keyword = keyword; 可以在網址看keyword用
  }
  let sql = "SELECT * FROM `vb_categories`" + where;
  // console.log(sql);
  db.queryAsync(sql)
    .then(results => {
      // output.catagories = results;
      res.json(results);
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
