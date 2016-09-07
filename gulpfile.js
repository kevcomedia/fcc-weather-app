const gulp = require("gulp");

const jshint = require("gulp-jshint");
const stylish = require("jshint-stylish");

const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const rename = require("gulp-regex-rename");

const browserSync = require("browser-sync").create();

/* Lint */
gulp.task("lint", function() {
  return gulp.src("src/js/**/*.es6.js")
    .pipe(jshint({
      esversion: 6
    }))
    .pipe(jshint.reporter(stylish));
});

/* Compile */
gulp.task("sass", function() {
  return gulp.src("src/scss/**/*.scss")
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ["> 1%"]
    }))
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task("babel", ["lint"], function() {
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

gulp.task("watch", ["sass", "babel", "browserSync"], function() {
  gulp.watch("src/scss/**/*.scss", ["sass"]);
  gulp.watch("src/js/**/*.es6.js", ["babel"]);
  gulp.watch("src/*.html", browserSync.reload);
});
