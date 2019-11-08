import encryption from '../models/encryption'

class Member{
    constructor(name, email, password){
        this.MR_name = name
        this.MR_email = email
        // this.MR_password = encryption(password)
        this.MR_password = password
        console.log(this.MR_name, this.MR_email, this.MR_password)
    }

    //進行加密
    

     //判斷email格式
     checkEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const result = re.test(email);
        return result;
    }

    queryEmail(){
        let sql = `SELECT MR_email FROM mr_information WHERE MR_email = '${this.MR_email}'`
        return sql
    }

    getAllMemberSql(){
        let sql = `SELECT * FROM mr_information WHERE 1`
        return sql
    }
    
    getAddMemberSql(){
        //會員編號
        // let querySid = `SELECT MAX(sid) FROM mr_information ORDER BY DESC `
        // console.log(querySid.sid);
        // let memberNum = "MR000" + i
        //進行加密
        // this.MR_password = encryption(this.MR_password)
        //塞入資料
        let sql = `INSERT INTO mr_information(MR_name, MR_email, MR_password, MR_personLevel, MR_createdDate) 
                        VALUES('${this.MR_name}', '${this.MR_email}', '${this.MR_password}', 1, now()) `
        return sql
    }

    
    getLoginSql(){
        let sql = `SELECT * FROM 'mr_information' WHERE MR_email = '${this.MR_email}' AND MR_password = '${this.MR_password}'`
        return sql
    }
    
}

export default Member