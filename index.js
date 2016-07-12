'use strict';

// dependencies.
var fs = require('fs'),
  spawn = require('child_process').spawn,
  temp = require('temp'),
  async = require('async');

/**
 * Configures the module.
 */
exports.configure = function () {

};

exports.generatePdf = function (filePath, callback) {
  // build a temp pdf file path.
  var tempPdfPath = temp.path({suffix:'.pdf'});

  // build the command line process args.
  var processArgs = ['/usr/AHFormatterV63_64/run.sh', '-d', filePath, '-o', tempPdfPath];

  // run the antenna house process.
  var child = spawn('sh', processArgs);

  // add event handlers for the child process.
  handleAHPDFError(child, callback);
  handleAHPDFExit(child, tempPdfPath, callback);
};

function handleAHPDFError(child, callback) {
  child.on('error', function (err) {
    callback(err);
  });

  child.stderr.on('data', function (data) {
    console.error('stderr: ' + data);
  });
}

function handleAHPDFExit(child, tempPdfPath, callback) {
  child.on('exit', createHandleAHPDFExit(tempPdfPath, callback));
}

function createHandleAHPDFExit(tempPdfPath, callback) {
  return function(code) {
    if ( code ) {
      return callback(new Error('Non 0 exit code from AHCmd spawn: ' + code));
    }

    async.waterfall([
      /**
       * Read the file data.
       * @param cb
       */
      function (cb) {
        fs.readFile(tempPdfPath, cb);
      },

      /**
       * Get rid of the temp file.
       * @param cb
       */
      function (fileData, cb) {
        fs.unlink(tempPdfPath, function (err) {
          return cb(err, fileData);
        });
      }
    ],
      function (err, fileData) {
        return callback(err, fileData);
      }
    );
  };
}