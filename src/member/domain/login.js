

class Login{
    constructor(email, password){
        this.MR_email = email
        this.MR_password = password
        // console.log(this.MR_email, this.MR_password)
    }


    getLoginSql(){
        // let sql = `SELECT MR_name,MR_email, MR_password FROM mr_information WHERE MR_email = '${this.MR_email}' AND MR_password = '${this.MR_password}'`
        let sql = `SELECT * FROM mr_information WHERE MR_email = '${this.MR_email}' AND MR_password = '${this.MR_password}'`
        return sql
    }

}

export default Login