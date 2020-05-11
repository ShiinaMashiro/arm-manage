'use strict'

process.argv.forEach(arg => {
  if (arg.startsWith('--e')) {
    process.env.VUE_APP_OREKI = arg.substr(3)
  }
})


module.exports = {
  devServer: {
    proxy: "http://10.3.10.71"
    // proxy: "http://10.3.10.99"
  },
  assetsDir: "assets",
}