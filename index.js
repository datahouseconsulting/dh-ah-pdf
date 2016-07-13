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

/**
 * Adds the child process on error event handler.
 * @param child - The reference to the child process.
 * @param callback - The finished callback function. callback(err);
 */
function handleAHPDFError(child, callback) {
  child.on('error', function (err) {
    callback(err);
  });

  child.stderr.on('data', function (data) {
    console.error('stderr: ' + data);
  });
}

/**
 * Adds the child process on exit event handler.
 * @param child - The reference to the child process.
 * @param tempPdfPath - The temporary pdf file path.
 * @param callback - The finished callback function. callback(err, fileData);
 */
function handleAHPDFExit(child, tempPdfPath, callback) {
  child.on('exit', createHandleAHPDFExit(tempPdfPath, callback));
}

/**
 * Returns a handler function the the on exit event of the AH formatter child process.
 * @param tempPdfPath - The file path to the temporary pdf file.
 * @param callback - The finished callback function. callback(err, fileData);
 * @returns {Function}
 */
function createHandleAHPDFExit(tempPdfPath, callback) {
  return function(code) {
    if ( code ) {
      return callback(new Error('Non 0 exit code from AHCmd spawn: ' + code));
    }

    async.waterfall([
      /**
       * Read the file data.
       * @param cb - The finished callback function.
       */
      function (cb) {
        fs.readFile(tempPdfPath, cb);
      },

      /**
       * Get rid of the temp file.
       * @param fileData - The file buffer data from the read file call.
       * @param cb - The finished callback function.
       */
      function (fileData, cb) {
        fs.unlink(tempPdfPath, function (err) {
          return cb(err, fileData);
        });
      }
    ],
      /**
       * The finished function for the waterfall call.
       * @param err - Error object if an error occurred.
       * @param fileData - The pdf file buffer data.
       * @returns {*}
       */
      function (err, fileData) {
        return callback(err, fileData);
      }
    );
  };
}