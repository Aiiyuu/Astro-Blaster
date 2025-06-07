const gulp = require('gulp');
const ts = require('gulp-typescript');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

const tsProject = ts.createProject('tsconfig.json');

// Paths
const paths = {
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'dist/styles'
    },
    scripts: {
        src: 'src/scripts/**/*.ts',
        dest: 'dist/scripts'
    },
    html: {
        src: 'src/**/*.html',
        dest: 'dist/'
    }
};

// Compile SCSS
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

// Compile TypeScript
function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

// Copy HTML files
function html() {
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream());
}

// Watch files & reload
function watch() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.html.src, html);
}

// Define complex tasks
const build = gulp.series(gulp.parallel(styles, scripts, html));

exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.watch = gulp.series(build, watch);
exports.default = build;
