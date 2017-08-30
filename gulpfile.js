const gulp  = require('gulp');
const zip = require('gulp-zip');
const exec = require('child_process').exec;
const template = require('gulp-template');

let p = require('./package.json');
p.humanizedName = humanize(p.name);

let emailName = p.author.split('@')[0];
p.authorName = emailName.charAt(0).toUpperCase() + emailName.slice(1);

const outputDir = './dist/' + p.name;

gulp.task('default', ['build']);

gulp.task('build', ['zip-mod']);

gulp.task('appveyor', ['set-appveyor-version', 'zip-mod']);

gulp.task('build-info', () =>
    gulp.src('./templates/*.*')
        .pipe(template(p))
        .pipe(gulp.dest(outputDir))
);

gulp.task('copy-src-files', () =>
    gulp.src('./src/*.lua')
        .pipe(gulp.dest(outputDir))
);

gulp.task('zip-mod', ['build-info', 'copy-src-files'], () => 
    gulp.src(outputDir + '/*.*', {base: './dist'})
        .pipe(zip(p.name + '_' + p.version + '.zip'))
        .pipe(gulp.dest('dist'))
);

gulp.task('set-appveyor-version', (cb) =>
{
    exec('appveyor UpdateBuild -Version "' + p.version + '+build%APPVEYOR_BUILD_NUMBER%"', (err) => {
        if (err) return cb(err);
        cb();
    });
});

function humanize(str) {
    var frags = str.split('-');
    for (i=0; i<frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
}