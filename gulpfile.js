let gulp  = require('gulp');
let mustache = require("gulp-mustache");
let rename = require("gulp-rename");
let zip = require('gulp-zip');
let p = require('./package.json');

let outputDir = './dist/' + p.name;

gulp.task('default', ['build']);

gulp.task('build', ['zip-mod']);

gulp.task('build-info', () =>
    gulp.src('./info.mustache')
        .pipe(mustache('./package.json'))
        .pipe(rename('info.json'))
        .pipe(gulp.dest(outputDir))
);

gulp.task('copy-src-files', () =>
    gulp.src('./src/*.*')
        .pipe(gulp.dest(outputDir))
);

gulp.task('zip-mod', ['build-info', 'copy-src-files'], () => 
    gulp.src(outputDir + '/*.*', {base: './dist'})
        .pipe(zip(p.name + '_' + p.version + '.zip'))
        .pipe(gulp.dest('dist'))
);