const gulp = require("gulp");
const browserSync = require("browser-sync").create();

/* BrowserSync */
gulp.task("browserSync", function() {
  browserSync.init({
    server: {
      baseDir: "src"
    }
  });
});

gulp.task("watch", ["browserSync"], function() {
  gulp.watch("src/*.html", browserSync.reload);
});
