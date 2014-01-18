/**
 * node-connect-sp server
 * standalone
 */

var express = require("express.io"),
    hogan = require("hogan-express"),
    routes = require("./routes"),
    path = require("path");

var app = express();
app.http().io();

app.configure(function () {
  app.disable("x-powered-by");
  app.set("port", process.env.PORT || 3000);

  // render settings
  app.set("views", path.resolve(__dirname, "views"));
  app.set("view engine", "html");
  app.engine("html", hogan);

  // logger
  app.use(express.logger("dev"));
  app.use(express.errorHandler());

  // static routings
  app.use(express.static(path.resolve(__dirname, "static")));

  // parser settings
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    key: "ncp::",
    secret: "secret:cups"
  }));

  // routings
  app.use(app.router);
});

app.io.configure(function () {
  app.io.enable("browser client minification");
  app.io.enable("browser client gzip");
  app.io.set("log level", 1);
});

routes.call(app);

app.listen(app.get("port"), "0.0.0.0", function () {
  console.log("Server started.");
});
