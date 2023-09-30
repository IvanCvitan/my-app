const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/v1', // Specify the endpoint you want to proxy
    createProxyMiddleware({
      target: 'https://api.oireachtas.ie', // Replace with your API's URL
      changeOrigin: true,
    })
  );
};