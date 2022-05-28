const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        ["/api/songs", "/api/mailer/", "/api/login", "/api/account/"],
        createProxyMiddleware({
            target: "http://localhost:8000",
            changeOrigin: true,
        })
    );
};
