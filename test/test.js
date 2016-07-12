/**
 * Created by kenton_chun on 7/12/16.
 */

var ahPdf = require('../index');
var fs = require('fs');

ahPdf.generatePdf('/home/parallels/Desktop/test_fo.xml', function (err, fileData) {
  console.log(err);
  console.log(fileData);

  fs.writeFile('/home/parallels/Desktop/test.pdf', fileData, function (err) {
    if (err) {
      console.log(err);
    }

    console.log('finished');
  });
});