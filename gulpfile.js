var gulp = require("gulp"),
    exec = require("gulp-exec");

gulp.task("default", function () {
  gulp.src("./")
      .pipe(exec("node_modules/.bin/apidoc -i routes -o static/docs"));
});
