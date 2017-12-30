const gulp = require('gulp');
const concat = require('gulp-concat');
//const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
//const minify = require('gulp-minify');
const gzip = require('gulp-gzip');
const order = require('gulp-deps-order');

var devMode = false;
const deletefile = require('gulp-delete-file');
gulp.task('deletefile', function() {
  gulp.src(['./dist/js/scripts.js',
  './dist/js/scripts2.js',
    './dist/js/scripts-min.js',
    './dist/css/main.css',
    './dist/views/**/**/*.html'
  ])
});

gulp.task('css', function() {
  gulp.src('./webapp/assets/css/*.css')
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./dist/css'))
  /*  .pipe(browserSync.reload({
        stream: true
    }));*/
});

gulp.task('js1', function() {
  gulp.src(['./webapp/assets/js/*.js'])
    .pipe(order())
    .pipe(concat('scripts2.js'))
    .pipe(uglify().on('error', function(e) {
      console.log(e);
    }))
    //.pipe(gzip()
    .pipe(gulp.dest('./dist/js'))
  /*.pipe(browserSync.reload({
      stream: true
  }));*/
});
gulp.task('js', function() {
  gulp.src('./webapp/scripts/**/**/*.js')
    .pipe(concat('scripts.js'))
    .pipe(uglify().on('error', function(e) {
      console.log(e);
    }))
    //.pipe(gzip())
    .pipe(gulp.dest('./dist/js'))
  /*.pipe(browserSync.reload({
      stream: true
  }));*/
});

gulp.task('html', function() {
  return gulp.src('./webapp/views/**/**/*.html')
    .pipe(gulp.dest('./dist/views'))
  /*  .pipe(browserSync.reload({
        stream: true
    }));*/
});

gulp.task('build', function() {
  gulp.start(['deletefile', 'js1', 'js', 'html', 'css'])
});

/*gulp.task('browser-sync', function() {
  browserSync.init(null, {
    open: false,
    server: {
      baseDir: 'dist',
    }
  });
});*/

gulp.task('start', function() {
  devMode = true;
  gulp.start(['build']);
  //gulp.watch(['./webapp/scripts/**/*.js'], ['js']);
  //gulp.watch(['./webapp/views/**/*.html'], ['html']);
  //gulp.watch(['./webapp/assets/*.css'], ['css']);


});
