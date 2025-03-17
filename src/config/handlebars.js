const handlebars = require("express-handlebars");
const path = require("path");

module.exports = (app) => {
  app.engine(
    "handlebars",
    handlebars.engine({
      defaultLayout: "main",
      partialsDir: path.join(__dirname, "../views", "partials"),
      runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
      },
    })
  );
  app.set("view engine", "handlebars");
  app.set("views", path.join(__dirname, "../views"));
};