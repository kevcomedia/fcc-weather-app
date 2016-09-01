const gulp = require("gulp");
const babel = require("gulp-babel");
const rename = require("gulp-regex-rename");
const browserSync = require("browser-sync").create();

/* Compile */
gulp.task("babel", function() {
  return gulp.src("src/js/**/*.es6.js")
    .pipe(babel({
      presets: ["es2015"]
    }))
    .pipe(rename(/\.es6\.js$/, ".js"))
    .pipe(gulp.dest("src/js"))
    .pipe(browserSync.reload({
      stream: true
    }));
});

/* BrowserSync */
gulp.task("browserSync", function() {
  browserSync.init({
    server: {
      baseDir: "src"
    }
  });
});

gulp.task("watch", ["babel", "browserSync"], function() {
  gulp.watch("src/js/**/*.es6.js", ["babel"]);
  gulp.watch("src/*.html", browserSync.reload);
});
