export const myUtil = {
  formatDate (date) {
    let str = date.getFullYear()
    let mon = date.getMonth() + 1
    str += "-"
    str += (mon > 9) ? mon.toString() :  "0" + mon
    str += "-"
    str += (date.getDate() > 9) ? date.getDate().toString() :  "0" + date.getDate()
    str += " "
    str += (date.getHours() > 9) ? date.getHours().toString() :  "0" + date.getHours()
    str += ":"
    str += (date.getMinutes() > 9) ? date.getMinutes().toString() :  "0" + date.getMinutes()
    str += ":"
    str += (date.getSeconds() > 9) ? date.getSeconds().toString() :  "0" + date.getSeconds()
    return str
  }
}