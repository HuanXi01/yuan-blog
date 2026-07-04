const path = require('path')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/yuan-blog/' : '/',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/pImages': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    },
    watchOptions: {
      ignored: [
        path.resolve(__dirname, 'public/uploads'),
        path.resolve(__dirname, 'public/pImages'),
        /node_modules/
      ]
    }
  }
}