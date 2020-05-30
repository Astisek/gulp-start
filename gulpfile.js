
// Plugins Init

var gulp = require('gulp');
var browserSync = require("browser-sync").create();
var del = require("del");
var autoprefixer = require("gulp-autoprefixer");
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');

// Functions List

// Images Compression

gulp.task("imgCompress", function () {
	return gulp.src('./demo/img/**')

	.pipe(imagemin())

	.pipe(gulp.dest('./build/img/'))
	.pipe(browserSync.stream())
	;
});

// Sass To Css With Compress

gulp.task('styleWork', function () {
	return gulp.src(['./demo/sass/**/*', '!./demo/sass/**/_*.*'])

	.pipe(sourcemaps.init())
	.pipe( sass({
		errorLogToConsole: true,
		outputStyle: 'compressed'
	}).on( 'error', notify.onError(
	{
		message: "<%= error.message %>",
		title  : "Sass Error!"
	})))
	.pipe(sourcemaps.write())

	.pipe(gulp.dest('./build/css/'))
	.pipe(browserSync.stream())
	;
});

// Compress JavaScript 

gulp.task('javascriptWork', function () {
	return gulp.src('./demo/js/**')

	.pipe(uglify())

	.pipe(gulp.dest('./build/js/'))
	.pipe(browserSync.stream())
});

// Copy Other File (except folder img, sass, js)

gulp.task('copyFile', function () {
	return gulp.src(['./demo/**/*', '!./demo/img', '!./demo/img/**/*', '!./demo/sass', '!./demo/sass/**/*','!./demo/js', '!./demo/js/**/*'])

	.pipe(gulp.dest('./build/'))
	.pipe(browserSync.stream())
});

// Clean Build Folder

gulp.task('delete', function () {
	return del('build/**/*');
});

//  Browser Sync

gulp.task('sync', function () {
	browserSync.init({
		server: {
			baseDir: "./build/",
		}
	});
});

//  Watch All Changes

gulp.task('watch', function () {
	gulp.watch('./demo/img/**/*', gulp.series("imgCompress"));
	gulp.watch('./demo/sass/**/*', gulp.series('styleWork'));
	gulp.watch('./demo/js/**/*', gulp.series('javascriptWork'));
	gulp.watch(['./demo/**/*', '!./demo/img', '!./demo/img/**/*', '!./demo/sass', '!./demo/sass/**/*','!./demo/js', '!./demo/js/**/*', '!./demo/**/*.html'], gulp.series('copyFile'));
	gulp.watch('./demo/*.html', () => {
		return gulp.src('./demo/**/*.html')
		.pipe(gulp.dest('./build'))
		.pipe(browserSync.stream())
	});
})

// Default Task
// Run This Task

gulp.task('default', 
	gulp.series("delete",
		gulp.parallel('imgCompress', 'styleWork', 'javascriptWork', 'copyFile'), 
		gulp.parallel('sync', 'watch')
		));
