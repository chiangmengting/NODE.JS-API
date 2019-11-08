import express from 'express'
import db from './db/database'
import member from './domain/member'
import login from './domain/login'
const router = express.Router()

//註冊
router.post('/register', (req, res, next) => {
    let Member = new member(req.body.name, req.body.email, req.body.password)

    //驗證email格式
    if(Member.checkEmail(req.body.email) === false){
        res.json({
            status: "註冊失敗。",
            err: "請輸入正確的Eamil格式"
        })
        return
    }else{

        // 尋找是否有重複的email
        db.query(Member.queryEmail(), (err, rows) => {
            console.log(rows);
            
                if(err){
                    res.status(404).json({
                       message: "伺服器錯誤，請稍後在試！"
                    })
                }
                // 如果有重複的email
                if(rows.length >=1){
                    res.json({
                        status: "註冊失敗",
                        message: "已有重複的Email。"
                     })
                     return
                }else{
                    db.query(Member.getAddMemberSql(), (err, data) => {
                        if(err){
                            res.json({
                                status: "已伺服器錯誤，請稍後在試",
                                message: "註冊失敗"
                             })
                            return;
                        }
                        // 若寫入資料庫成功，則回傳給clinet端下：
                        res.json({
                            message: "註冊成功"

                         })
                      })
                }
        })
    }
})

//登入
router.post('/login', (req, res, next) => {
    let Member = new login(req.body.email, req.body.password)
    
    db.query(Member.getLoginSql(), (err, rows) => {
        // console.log(rows);
        
        if( rows.length == 0){
            res.json({
                status:"登入失敗",
                message:"請輸入正確的帳號或密碼"
            })
            return
        }else if(err){
            res.json({
                status:"登入失敗",
                message:"伺服器錯誤，請稍後在試！"
            })
            return
        }else{
            res.locals.userId = rows[0].sid;
            //設定session
            req.session.sid = res.locals.userId; 
            // console.log(req.session.sid);

            res.json({
                status:"登入成功",
                message:"歡迎" + rows[0].MR_name + "的登入!",
                info: rows[0]
            })
        }
    })

})


//查詢所有會員資料
// router.get('/', (req, res, next)=>{
//     let Member = new member()
//     db.query(Member.getAllMemberSql(), (err, rows)=>{
//         // console.log(rows.length);
//         res.send(rows)
//     })
// })

//登出，清除session
router.get('/logout', (req, res)=>{
    req.session.destroy()
    res.redirect('/login')
})





module.exports = router;