const gulp = require("gulp")
const rename = require("gulp-rename")
const sass = require('gulp-sass')
const minify = require('gulp-clean-css')
const uglify = require('gulp-uglify-es').default

gulp.task("minifyJS", function () {
    return gulp.src(["js/*.js", "!js/*.min.js"])
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('js'))
})

gulp.task("minifyCSS", function () {
    return gulp.src(['css/*.css', "!css/*.min.css"])
        .pipe(minify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('css'))
})

gulp.task("compileSASS", function () {
    return gulp.src("scss/*.scss")
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('css'))
})

gulp.task('watch:css', function () {
    return gulp.watch(['css/*.css', '!css/*.min.css'], gulp.series('minifyCSS'))
})

gulp.task('watch:js', function () {
    return gulp.watch(['js/*.js', '!js/*.min.js'], gulp.series('minifyJS'))
})

gulp.task('watch:scss', function () {
    return gulp.watch('scss/*.scss', gulp.series('compileSASS'))
})

gulp.task('watch', gulp.parallel('watch:css', 'watch:js', 'watch:scss'))
gulp.task('default', gulp.series('minifyJS', 'minifyCSS', 'compileSASS'))