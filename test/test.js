/**
 * Created by kenton_chun on 7/12/16.
 */

var ahPdf = require('../index');
var fs = require('fs');

ahPdf.generatePdf('/home/uranakam/Desktop/test_fo.xml', function (err, fileData) {
  if (err) {
    console.log(err);
    return;
  }

  fs.writeFile('/home/uranakam/Desktop/test.pdf', fileData, function (err) {
    if (err) {
      console.log(err);
    }

    console.log('finished');
  });
});