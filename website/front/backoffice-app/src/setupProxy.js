const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use([
    '/api/backoffice/login',
    '/api/backoffice/check-session',
    '/api/backoffice/classes',
    '/api/backoffice/subjects',
    '/api/backoffice/plans',
    ],
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );
};