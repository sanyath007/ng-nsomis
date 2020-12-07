var gulp = require('gulp');
var gulpif = require('gulp-if');
var useref = require('gulp-useref');
var minifyCss = require('gulp-clean-css');
var cachebust = require('gulp-cache-bust');
var replace = require('gulp-string-replace');
var uglifyes = require('uglify-es');
var composer = require('gulp-uglify/composer');
var uglify = composer(uglifyes, console);
var del = require('del');
const { minify } = require('uglify-js');
var versionTimeStamp = "" + Date.now();

gulp.task('delete_all', function() {
    return del([
        'public/*.*',
        'public/css/*.*',
        'public/img/*.*',
        'public/js/*.*',
        'public/templates/*.*'
    ]);
});

gulp.task('minify', function() {
    return gulp.src('index.html')
            .pipe(useref())
            .pipe(replace('___REPLACE_IN_GULP___', versionTimeStamp))
            .pipe(gulpif('*.js', uglify()))
            .pipe(gulpif('*.css', minifyCss()))
            .pipe(cachebust({
                type: 'timestamp'
            }))
            .pipe(gulp.dest('dist'));
});

gulp.task('copy1', function() {
    return gulp.src('templates/*')
            .pipe(gulp.dest('dist/templates'));
});

gulp.task('copy2', function() {
    return gulp.src('img/*.*')
            .pipe(gulp.dest('dist/img'));
});

gulp.task('default', gulp.series('delete_all', 'minify', 'copy1', 'copy2'));
