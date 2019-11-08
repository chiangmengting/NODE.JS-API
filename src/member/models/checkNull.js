
//判斷空值
module.exports = function checkNull(data) {
    for (var key in data) {
        // 不為空
        return false;
    }
    // 為空值
    return true;
}