const gulp = require("gulp");
const gulpIf = require("gulp-if");

const jshint = require("gulp-jshint");
const stylish = require("jshint-stylish");

const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const rename = require("gulp-regex-rename");

const useref = require("gulp-useref");
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");
const del = require("del");
const runSequence = require("run-sequence");

const deploy = require("gulp-gh-pages");

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

/* Build */
gulp.task("useref", function() {
  return gulp.src("src/*.html")
    .pipe(useref())
    .pipe(gulpIf("*.js", uglify()))
    .pipe(gulpIf("*.css", cssnano()))
    .pipe(gulp.dest("dist"));
});

gulp.task("clean:dist", function() {
  return del.sync("dist");
});

gulp.task("build", function(callback) {
  runSequence("clean:dist", ["sass", "babel"], "useref", callback);
});

gulp.task("deploy", ["build"], function() {
  return gulp.src("dist/**/*")
    .pipe(deploy());
});

gulp.task("watch", ["sass", "babel", "browserSync"], function() {
  gulp.watch("src/scss/**/*.scss", ["sass"]);
  gulp.watch("src/js/**/*.es6.js", ["babel"]);
  gulp.watch("src/*.html", browserSync.reload);
});
