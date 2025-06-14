/**
 * gulpfile.js
 *
 * Automates build tasks: compiles SCSS, compiles TypeScript, copies HTML & assets,
 * and runs a development server with live reload.
 */

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
    },
    assets: {
        src: 'src/assets/**/*',
        dest: 'dist/assets'
    }
};

/**
 * Compile SCSS files into CSS with sourcemaps and stream to browserSync.
 */
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

/**
 * Compile TypeScript files with sourcemaps and stream to browserSync.
 */
function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

/**
 * Copy HTML files from source to dist and stream to browserSync.
 */
function html() {
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream());
}

/**
 * Copy static assets (images, etc.) from source to dist.
 */
function assets() {
    return gulp.src(paths.assets.src, { base: 'src/assets', buffer: true, encoding: false })
        .pipe(gulp.dest(paths.assets.dest))
        .on('error', (err) => console.error('Assets error:', err));
}

/**
 * Watch for file changes, rebuild as needed, and reload browser.
 */
function watch() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.assets.src, assets);
    gulp.watch(paths.html.src, html);
}

/**
 * Delete the dist folder before build
 */
async function clean() {
    const del = (await import('del')).default;
    console.log('del:', del);
    return del(['dist']);
}

// Build task: run styles, scripts, html, and assets in parallel.
const build = gulp.series(clean, gulp.parallel(styles, scripts, html, assets));

exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.assets = assets;
exports.watch = gulp.series(build, watch);
exports.clean = clean;
exports.default = build;
