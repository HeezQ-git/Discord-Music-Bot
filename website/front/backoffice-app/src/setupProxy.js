const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    [
      '/api/backoffice/songs',
      '/api/backoffice/mailer/',
      '/api/backoffice/login',
      '/api/backoffice/account/',
    ],
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );
};