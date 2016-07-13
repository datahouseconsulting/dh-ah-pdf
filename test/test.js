/**
 * Created by kenton_chun on 7/12/16.
 */

var ahPdf = require('../index');
var fs = require('fs');

ahPdf.generatePdf('File Path', function (err, fileData) {
  if (err) {
    console.log(err);
    return;
  }

  fs.writeFile('File PAth', fileData, function (err) {
    if (err) {
      console.log(err);
    }

    console.log('finished');
  });
});