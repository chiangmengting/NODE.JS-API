const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const db = mysql.createConnection({
    host: "192.168.27.186",
    user: "Ruby",
    password: "1010",
    database: "pbook"
  });
  db.connect();
  const bluebird = require("bluebird");
  bluebird.promisifyAll(db);

router
  .route("/homepage/:id?")
  .all((req, res, next) => {
    next();
  })
  .get((req, res) => {
    let sql = "SELECT * FROM `fm_article` WHERE `fm_featured`=1";
    db.query(sql, (error, results, fields) => {
      if (error) throw error;
      res.json(results);
    });
  });
module.exports = router;
