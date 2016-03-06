var fs       = require('fs'),
    exec     = require('child_process').exec,
    join     = require('path').join,
    basename = require('path').basename,
    osHomedir = require('os-homedir');

// var daemons_path = '/Library/LaunchDaemons';
var daemons_path = osHomedir() + '/Library/LaunchAgents';

///////////////////////////////////////////
// helpers

var debug    = !!process.env.DEBUG,
    log      = debug ? console.log : function() { }; 

var get_path = function(name) {
  return name.indexOf(daemons_path) === -1 ? join(daemons_path, name + '.plist') : name;
}

// copies a file
var copy = function(source, target, cb) {
  var is  = fs.createReadStream(source),
      os  = fs.createWriteStream(target),
      out = 0;

  var done = function(err) {
    if (out++ > 0) return;
    cb(err);
  };

  is.on('end', done);
  is.on('error', done);
  os.on('error', done);

  is.pipe(os);
};

///////////////////////////////////////////
// our guy

var launchd = {};

var run = function(command, cb) {
  exec('launchctl ' + command, function(err, stdout, stderr) {
    if (stdout.length > 0) log(stdout.toString());
    cb(err, stdout, stderr);
  });
}

launchd.exists = function(name, cb) {
  run('list', function(err, out) {
    if (err) return cb(err);

    var regex = new RegExp(name + '\n'),
        bool = out.toString().match(regex) ? true : false;

    cb(null, bool);
  })
}

launchd.start = function(name, cb) {
  return run('start ' + name, cb)
}

launchd.stop = function(name, cb) {
  return run('stop ' + name, cb)
}

// load('com.company.software', cb)
launchd.load = function(name, cb) {
  var path = get_path(name);

  log('Loading script: ' + path);
  run('load ' + path, cb);
}

// unload('com.company.software', cb)
launchd.unload = function(name, cb) {
  var path = get_path(name);

  log('Unloading script: ' + path);
  run('unload ' + path, cb);
}

// install('/path/to/com.company.software.plist', cb)
launchd.install = function(script_path, cb) {
  var file = basename(script_path),
      name = file.replace('.plist', ''),
      destination = join(daemons_path, file);

  log('Copying script to ' + destination);
  copy(script_path, destination, function(err) {
    if (err) return cb(err);

    launchd.load(name, cb);
  })
}

// remove('com.company.software', cb)
launchd.remove = function(name, cb) {
  var path = get_path(name);

  fs.exists(path, function(exists) {
    if (!exists) return cb(new Error('Not found: ' + path));

    launchd.unload(path, function(err) {
      if (err) return cb(err);

      log('Removing script: ' + path);
      fs.unlink(path, cb);
    })
  })
}

module.exports = launchd;
