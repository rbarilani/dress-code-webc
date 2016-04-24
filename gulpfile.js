var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var replace = require('gulp-replace');
var browserSync = require('browser-sync').create();
var pkg = require('./package.json');

gulp.task('default', function (done) {
   return runSequence('build', 'demo', done);
});

gulp.task('serve', function (done) {
    return runSequence('default', 'demo:serve', done);
});


/**
 *
 *
 *
 * DEMO
 *
 *
 *
 */
gulp.task('demo', function (done) {
    return runSequence('demo:styles', 'demo:dress-code-webc', done);
});

gulp.task('demo:styles', function () {
    return gulp
        .src('demo/index.scss')
        .pipe(sass())
        .pipe(gulp.dest('demo'));
});

gulp.task('demo:dress-code-webc', function () {
    gulp.src('dist/*.html')
        .pipe(gulp.dest(path.join('demo/', pkg.name)));
});


// Static server
gulp.task('demo:serve', function() {
    browserSync.init({
        server: {
            baseDir: "./demo"
        }
    });
});
/**
 *
 *
 *
 *  BUILD
 *
 *
 *
 **/
gulp.task('build', function (done) {
  return runSequence('build:styles', 'build:templates', 'build:copy', done);
});

gulp.task('build:copy', function (done) {
    return gulp.src('.tmp/build/**/*.html')
        .pipe(rename(function (path) {
            path.dirname = '';
            return path;
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('build:styles', function () {
    return gulp.src(['src/**/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('.tmp/build'));
});

gulp.task('build:templates', function() {
    var root = '.tmp/build/';
    var replaceRegex = /<link rel="import" type="css" href="(.*)">/g;
    var replaceFn = function(link, href) {
        var css = fs.readFileSync(path.resolve(root, href), 'utf8');
        return '<style>\n' + css + '\n</style>';
    };

    var renameFn = function (path) {
        path.basename = path.basename.replace(/\.template/g, '');
        return path;
    };

    return gulp
        .src(['src/**/*.template.html'])
        .pipe(replace(replaceRegex, replaceFn))
        .pipe(rename(renameFn))
        .pipe(gulp.dest('.tmp/build'));
});
