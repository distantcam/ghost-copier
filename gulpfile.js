let gulp  = require('gulp');
let mustache = require("gulp-mustache");
let rename = require("gulp-rename");
let zip = require('gulp-zip');
var exec = require('child_process').exec;
let p = require('./package.json');

let outputDir = './dist/' + p.name;

gulp.task('default', ['build']);

gulp.task('build', ['zip-mod']);

gulp.task('appveyor', ['set-appveyor-version', 'zip-mod']);

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

gulp.task('set-appveyor-version', (cb) =>
{
    exec('appveyor UpdateBuild -Version "' + p.version + '+build$APPVEYOR_BUILD_NUMBER"', (err) => {
        if (err) return cb(err);
        cb();
    });
    return cb();
});

