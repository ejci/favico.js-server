var gulp = require('gulp'), spawn = require('child_process').spawn, node;

//start server
gulp.task('server', function() {
    if (node)
        node.kill();
    node = spawn('node', ['app.js'], {
        stdio : 'inherit'
    });
    node.on('close', function(code) {
        if (code === 8) {
            console.error('Error detected, waiting for changes...');
            gulp.run('server');
        }
    });
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(['./app.js', './lib/**/*.js'], ['server']);
});

//default task
gulp.task('default', ['server', 'watch']);
// clean up if an error goes unhandled.

process.on('exit', function() {
    if (node)
        node.kill();
});
