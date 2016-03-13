////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Compilation instructions for cs-status project for creating a reliable notification / status notification system   //
// in AngularJS.                                                                                                      //
//                                                                                                                    //
// Dan Taylor                                                                                                         //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var gulp        = require('gulp');
var del         = require('del');
var templ       = require('gulp-ngtemplate');
var htmlmin     = require('gulp-htmlmin');
var docs        = require('gulp-ngdocs');
var less        = require('gulp-less');
var Server      = require('karma').Server;

gulp.task('clean', function() {
    del(['dist/', '.tmp/', 'artifacts/']);
});

gulp.task('docs', function() {
    return gulp.src('./src/**/*.js')
        .pipe(docs.process())
        .pipe(gulp.dest('./artifacts/docs'));
});

gulp.task('styles:dist', function() {
    return gulp.src('./src/*.less')
        .pipe(less())
        .pipe(gulp.dest('./dist/styles/'));
});

gulp.task('templates:dist', function() {
   gulp.src('src/**/*.html')
       .pipe(htmlmin({collapseWhitespace: true}))
       .pipe(templ({module: 'cs-notify'}))
       .pipe(gulp.dest('.tmp/'));
});

gulp.task('test', function() {
    new Server({
        configFile: __dirname + '/test/unit/karma.conf.js',
        singleRun: true
    }).start();
});

// Intentionally do not clean before a build
gulp.task('default', ['templates:dist', 'styles:dist', 'docs', 'test'], function() {
});

