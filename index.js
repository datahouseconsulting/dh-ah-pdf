'use strict';

// dependencies.
var fs = require('fs'),
  spawn = require('child_process').spawn,
  temp = require('temp').track(),
  async = require('async');

// reference to a custom logger.
var logger = null;

/**
 * Sets a custom logger.
 * @param loggerRef - The reference to the custom logger.
 */
exports.setLogger = function (loggerRef) {
  logger = loggerRef;
};

/**
 * Generates a PDF from a XML or FO data file.
 *
 * @param filePath - The file path to the XML or FO file. Must be full path.
 * @param callback - The finished callback function. callback(err, pdfFileData);
 */
exports.generatePdf = function (filePath, callback) {
  // build a temp pdf file path.
  var tempPdfPath = temp.path({suffix:'.pdf'});

  // build the command line process args.
  var processArgs = ['/usr/AHFormatterV63_64/run.sh', '-extlevel', '4', '-d', filePath, '-o', tempPdfPath];

  // if the file doesn't exist, exit the function with an error.
  if (!fileExists(filePath)) {
    logError('File at file path: ' + filePath + ' does not exist.');
    return callback(new Error('File at file path: ' + filePath + ' does not exist.'));
  }

  // run the antenna house process.
  var child = spawn('sh', processArgs);

  // add event handlers for the child process.
  handleAHPDFError(child, callback);
  handleAHPDFExit(child, tempPdfPath, callback);
};

/**
 * Checks if a file exists.
 * @param filePath - The file path.
 */
function fileExists (filePath) {
  try
  {
    return fs.statSync(filePath).isFile();
  }
  catch (err)
  {
    return false;
  }
}

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
    logError('stderr: ' + data);
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
        // if an error occurred. log the file.
        if (err) {
          logError(err.message);
          logError(err.stack);
        }
        return callback(err, fileData);
      }
    );
  };
}

/**
 * Writes an info message to the logger or std out.
 * @param message - The message to write.
 */
function logInfo(message) {
  if (logger && (typeof logger.info === 'function')) {
    logger.info(message);
  }
  else {
    console.log(message);
  }
}

/**
 * Writes an warning message to the logger or std out.
 * @param message - The message to write.
 */
function logWarn(message) {
  if (logger && (typeof logger.info === 'function')) {
    logger.warn(message);
  }
  else {
    console.log(message);
  }
}

/**
 * Writes an error message to the logger or std out.
 * @param message - The message to write.
 */
function logError(message) {
  if (logger && (typeof logger.error === 'function')) {
    logger.error(message);
  }
  else {
    console.error(message);
  }
}