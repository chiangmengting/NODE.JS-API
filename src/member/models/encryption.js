const crypto = require('crypto')

//進行密碼加密
module.exports =  function getEncryption(password) {
    let hashPassword = crypto.createHash('sha1')
    hashPassword.update(password)
    const rePassword = hashPassword.digest('hex')
    return rePassword;
}


