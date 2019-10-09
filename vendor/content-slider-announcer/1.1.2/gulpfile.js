const browserify = require('browserify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const config = require('./package.json');

const paths = {
  scripts: {
    src: './src/*.js',
    dest: './assets/js',
  },
  styles: {
    src: './sass/**/*.scss',
    dest: './assets/css',
  },
};

const bundleName = 'content-slider-announcer';
const globalName = 'IMAGINARY.ContentSliderAnnouncer';
const externalDependencies = Object.keys(config.dependencies);

function scripts() {
  return browserify({
    extensions: ['.js'],
    entries: './src/main.js',
    standalone: globalName,
  })
    .external(externalDependencies)
    .transform('babelify', { presets: ['@babel/env'] })
    .on('error', (msg) => {
      console.error(msg);
    })
    .bundle()
    .pipe(source(`${bundleName}.js`))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(uglify())
    .pipe(rename(`${bundleName}.min.js`))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function styles() {
  return gulp.src(paths.styles.src, { sourcemaps: true })
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest));
}

function watch() {
  gulp.watch(paths.scripts.src, scripts);
}

const build = gulp.parallel(scripts, styles);

exports.scripts = scripts;
exports.styles = styles;
exports.watch = watch;

exports.build = build;
exports.default = build;
