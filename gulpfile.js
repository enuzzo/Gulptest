var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	jade = require('gulp-jade'),
	notify = require('gulp-notify'),
	jshint = require('gulp-jshint'),
	concat = require('gulp-concat'),
	addsrc = require('gulp-add-src'),
	order = require('gulp-order'),
	autoprefixer = require ('gulp-autoprefixer')
	uglify = require('gulp-uglify'),
	browserSync = require('browser-sync'),
	rename = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	reload = browserSync.reload;

// Sass Task 
gulp.task('sass', function() {
    return sass('dev/scss/styles.scss', { 
    	style: 'compressed',
    	loadPath: 'bower_components/bootstrap-sass-official/assets/stylesheets',
    	sourcemap: true 
    })
    .on('error', function (err) {
      console.error('Error', err.message);
   	})
    	.pipe(notify("Task: sass"))
   		.pipe(autoprefixer())
		.pipe(rename({suffix:".min"})) // Se non vanno piu' le mappe e' perche' l'ho spostato prima delle sourcemaps
	    .pipe(sourcemaps.write('maps', {
	        includeContent: false,
	        sourceRoot: '/dev/scss/'
	    }))
	    .pipe(gulp.dest('css'))
		.pipe(reload({stream: true}))
});

// Jade Task
gulp.task('jade', function() {
	return gulp.src('dev/jade/*.jade')
		.pipe(notify("Task: jade"))
		.pipe(jade({pretty: true}))
		.pipe(gulp.dest('./'))
		.pipe(reload({stream: true}))
});

// JS Task
gulp.task('js', function(){
  return gulp.src('dev/js/scripts.js')
  .pipe(notify("Task: sass"))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(addsrc('bower_components/jquery/dist/jquery.min.js'))
    .pipe(order([
	    "bower_components/jquery/dist/jquery.js",
    	"dev/js/scripts.js",
  		]))
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest('js'))
    .pipe(reload({stream: true}))
});

// Default: Watch and Browsersync
gulp.task('default', function () {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("dev/scss/*.scss", ['sass']);
    gulp.watch("dev/jade/*.jade", ['jade']);
    gulp.watch("dev/js/*.js", ['js']);
});


