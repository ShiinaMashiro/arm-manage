'use strict'

process.argv.forEach(arg => {
  if (arg.startsWith('--enable')) {
    process.env.VUE_APP_OREKI = arg.substr(8)
  }
})


module.exports = {
  devServer: {
    proxy: "http://10.3.10.71"
    // proxy: "http://10.3.10.99"
  },
  assetsDir: "assets",
}