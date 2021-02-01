const { src, dest, watch, parallel, series } = require("gulp");
// const gulp = require("gulp");
const scss = require("gulp-sass");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const uglify = require("gulp-uglify-es").default; /* Сжимаем, минифицирует скрипт */
const autoprefixer = require("gulp-autoprefixer"); /* Совместимость со старыми браузерами дбля цсс */
const imagemin = require("gulp-imagemin");
const del = require("del");
const cleanCSS = require("gulp-clean-css");
const htmlmin = require("gulp-htmlmin");

function browsersync() {
	browserSync.init({
		server: {
			baseDir: "app/",
		},
	});
}

function cleanDist() {
	return del("dist");
}

function html() {
	return src("app/*.html")
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(dest("dist"))
		.pipe(browserSync.stream());
}

function styles() {
	return src(["app/styles/*.+(scss|sass)", "!app/styles/main.min.css"]) /* Где искать файл */
		.pipe(scss({ outputstile: "compressed" }).on("error", scss.logError)) /* Через что будем фильтровать */
		.pipe(concat("main.min.css")) /* Объединяет файлы в один с заданым названием */
		.pipe(autoprefixer()) /* { overrideBrowserslist: ["last 10 version"], grid: true } */
		.pipe(cleanCSS({ compatibility: "ie8" }))
		.pipe(dest("app/styles")) /* Куда будем выбрасывать файл*/
		.pipe(browserSync.stream()); /* Аналог лайв сервер */
}

function scripts() {
	return src([
		"app/scripts/*.js",
		"!app/scripts/main.min.js" /* "node_modules/jquery/dist/jquery.js", */,
	]) /* Подключаем скаченный jquery для примера*/
		.pipe(uglify()) /* Можно сжимать один файл */
		.pipe(concat("main.min.js")) /* В один файл */
		.pipe(dest("app/scripts")) /* Куда сохранить  */
		.pipe(browserSync.stream()); /* Аналог лайв сервер */
}

function images() {
	return src("app/img/**/*")
		.pipe(
			imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.mozjpeg({ quality: 75, progressive: true }),
				imagemin.optipng({ optimizationLevel: 5 }),
				imagemin.svgo({
					plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
				}),
			]),
			{ base: "app" /* Что бы переносило с папками base: "app" */ }
		)
		.pipe(dest("dist/img"));
}

function build() {
	/* Переносим все файлы в дист */
	return src(["app/styles/main.min.css", "app/fonts/**/*", "app/scripts/main.min.js"], {
		base: "app" /* Что бы переносило с папками base: "app" */,
	}).pipe(dest("dist"));
}

function watching() {
	watch(
		["app/styles/**/*.+(scss|sass)"],
		styles
	); /* Смотрим за всеми файлами в папке и используем к ним функицю "Styles" */
	watch(
		["app/scripts/**/*.js", "!app/scripts/*.min.js"],
		scripts
	); /* Смотрим за всеми файлами в папке и используем к ним функицю "Styles" */
	watch(["app/**/*.html"]).on("change", browserSync.reload);
}

exports.browsersync = browsersync;
exports.cleanDist = cleanDist;
exports.images = images;
exports.scripts = scripts;
exports.styles = styles; /*  Назначаем ключевое слово на данный таск */
exports.watching = watching;
exports.html = html;

exports.build = series(cleanDist, images, html, build);
exports.default = parallel(styles, scripts, browsersync, watching); /* Назначаем выполнение по умолчанию */
