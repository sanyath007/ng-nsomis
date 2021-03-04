var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uglify = require('gulp-uglify-es').default;
var concat = require('gulp-concat')
var minifyCss = require('gulp-minify-css');
var notify = require("gulp-notify");
var replace = require('gulp-string-replace');
var versionTimeStamp = "" + Date.now();

gulp.task('css', function() {
    return gulp.src([        
        'node_modules/select2/dist/css/select2.min.css',
        'node_modules/admin-lte/plugins/fontawesome-free/css/all.min.css',
        'node_modules/admin-lte/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css',
        'node_modules/admin-lte/plugins/icheck-bootstrap/icheck-bootstrap.min.css',
        'node_modules/admin-lte/plugins/jqvmap/jqvmap.min.css',
        'node_modules/admin-lte/dist/css/adminlte.min.css',
        'node_modules/admin-lte/plugins/overlayScrollbars/css/OverlayScrollbars.min.css',
        'node_modules/admin-lte/plugins/daterangepicker/daterangepicker.css',
        'node_modules/admin-lte/plugins/summernote/summernote-bs4.min.css',
        'node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css',
        'node_modules/angularjs-toaster/toaster.css',
        'node_modules/angular-loading-bar/build/loading-bar.min.css',
        'assets/css/**/*.css',
    ])
    .pipe(minifyCss())
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(notify({ message: "CSS files successfully concated and reduced" }));
});

gulp.task('webfonts', function() {
    return gulp.src([
        'node_modules/admin-lte/plugins/fontawesome-free/webfonts/*',
    ])
    .pipe(gulp.dest('dist/assets/webfonts'))
    .pipe(notify({ message: "Copy webfont for css files successfully" }));
});

gulp.task('venderjs', function() {
    return gulp.src([
        'node_modules/admin-lte/plugins/jquery/jquery.min.js',
        'node_modules/admin-lte/plugins/jquery-ui/jquery-ui.min.js',
        'node_modules/admin-lte/plugins/bootstrap/js/bootstrap.bundle.min.js',
        'node_modules/admin-lte/plugins/moment/moment.min.js',
        'node_modules/admin-lte/dist/js/adminlte.js',
        'node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js',
        'assets/js/**/*.js',
        'node_modules/bootstrap-datepicker/dist/locales/bootstrap-datepicker.th.min.js',
        'node_modules/angular/angular.min.js',
        'node_modules/angular-route/angular-route.min.js',
        'node_modules/angular-animate/angular-animate.min.js',
        'node_modules/angularjs-toaster/toaster.min.js',
        'node_modules/ngstorage/ngstorage.min.js',
        'node_modules/select2/dist/js/select2.full.min.js',
        'node_modules/angular-loading-bar/build/loading-bar.min.js',
    ])
    .pipe(uglify())
    .pipe(concat('vendor-bundle.js'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(notify({ message: "Vendor JS files successfully concated and reduced" }));
});

gulp.task('appjs', function() {
    return gulp.src([
        'app/app.js',
        'app/routes.js',
        'app/controllers/**/*.js',
        'app/services/**/*.js',
        'app/directives/**/*.js',
        'app/filters/**/*.js',
    ])
    .pipe(uglify())
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(notify({ message: "App JS files successfully concated and reduced" }));
});

gulp.task('images', function() {
    return gulp.src([
        'assets/img/**/*'
    ])
    .pipe(gulp.dest('dist/assets/img'))
    .pipe(notify({ message: "Copy image files successfully" }));
});

gulp.task('templates', function () {
    return gulp.src('templates/**/*')
        .pipe(gulp.dest('dist/templates'))
        .pipe(notify({ message: "Copy template files successfully" }));
});

gulp.task('default', gulp.series('appjs', 'templates')); //'css', 'webfonts', 'venderjs', 'images', 'appjs', 'templates'
