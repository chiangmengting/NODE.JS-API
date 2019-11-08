const mysql = require('mysql')
const bluebird = require('bluebird')
const db = mysql.createConnection({
    host: '192.168.27.186',
    user: 'root',
    password: 'root',
    database: 'pbook',
})
db.connect();
bluebird.promisifyAll(db)

let sql = "SELECT * FROM `ac_pbook2`";
let data
async function List(req, res) {    
    try {
        data = await db.queryAsync(sql)
    }catch(err){
        console.log(err);
    }
    
    return data
}

module.exports = List
