const db = require('../db/database')

module.expoerts = function memberLogin(memberData) {
    let result = {}
    return new Promise((resolve, reject)=>{
        db.query(`SELECT * FROM 'mr_information' WHERE MR_email = ? && MR_password = ?`, 
        [memberData.email, memberpassword], function(err, rows){
            if (err) {
                result.status = "登入失敗。"
                result.err = "伺服器錯誤，請稍後在試！"
                reject(result);
                return;
            }
            resolve(rows);
        })
    })
    
}