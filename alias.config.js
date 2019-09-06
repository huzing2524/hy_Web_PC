const resolve = dir => require('path').join(__dirname, dir);

module.exports = {
  resolve: {
    alias: {
      '@': resolve('src'),
      '_assets': resolve('src/assets'),
      '_api': resolve('src/api'),
      '_components': resolve('src/components'),
      '_views': resolve('src/views'),
      '_common': resolve('src/common'),
    }
  }
};
