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
    /*proxy: {
      '/ssh/host': {
        target: 'http://10.3.10.71:2222',
        ws: true
      },
      '/': {
        target: 'http://10.3.10.71'
      }
    }*/
  },
  assetsDir: "assets",
}