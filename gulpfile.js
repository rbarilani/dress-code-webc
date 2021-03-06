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
    return runSequence('demo:styles', 'demo:copy-dist', done);
});

gulp.task('demo:styles', function () {
    return gulp
        .src('demo/index.scss')
        .pipe(sass())
        .pipe(gulp.dest('demo'))
        .pipe(browserSync.stream());
});

gulp.task('demo:copy-dist', function () {
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

    // build
    gulp.watch('./src/**/*.scss', ['build:styles']);
    gulp.watch(['./.tmp/build/**/*.css', './src/**/*.template.html'], ['build:templates']);
    gulp.watch('./.tmp/build/**/*.html', ['build:copy']);

    // demo
    gulp.watch('demo/index.scss', ['demo:styles']);
    gulp.watch('dist/**/*.html', ['demo:copy-dist']);
    gulp.watch('demo/**/*.html').on('change', browserSync.reload);
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

gulp.task('build:copy', function () {
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
    var cssRoot = '.tmp/build/';
    var jsRoot = './src';
    var replaceCssRegex = /<link rel="import" type="css" href="(.*)">/g;
    var replaceJsRegex = /<script rel="import" src="(.*)"><\/script>/g;
    var replaceCssFn = function(link, href) {
        var css = fs.readFileSync(path.resolve(cssRoot, href), 'utf8');
        return '<style>\n' + css + '\n</style>';
    };
    var replaceJsFn = function(script, src) {
        var js = fs.readFileSync(path.resolve(jsRoot, src), 'utf8');
        return '<script>\n' + js + '\n</script>';
    };
    var renameFn = function (path) {
        path.basename = path.basename.replace(/\.template/g, '');
        return path;
    };

    return gulp
        .src(['src/**/*.template.html'])
        .pipe(replace(replaceCssRegex, replaceCssFn))
        .pipe(replace(replaceJsRegex, replaceJsFn))
        .pipe(rename(renameFn))
        .pipe(gulp.dest('.tmp/build'));
});
