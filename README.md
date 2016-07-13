# DH-AH-PDF

This is a node module that allows you to create PDF files using xml or fo files.
This module uses the Antenna House AHFormatter tool.

## System Requirements

    This module currently only works on linux.

## Setup

- If you want to add your own logger to the module, you can use the setLogger function. Note: this assumes your logger has 3 function (info, warn, error). If any of those functions are not present, it will default to logging to the console.

  ```javascript
  var ahPdf = require('dh-ah-pdf');
  ahPdf.setLogger(logger);
  ```

- The module contains a copy of the AHFormatter binary that it works will. Option 1: To install using script:

        sudo sh configure.sh

- Option 2: Install using the following commands:

        apt-get install alien
        gzip -N -d AHFormatterV63_64-6.3E-MR3.x86_64.rpm.gz
        alien -i -d -c AHFormatterV63_64-6.3E-MR3.x86_64.rpm

## Create a PDF:

1) Create a PDF from an xml or FO file:

```javascript
var ahPdf = require('dh-ah-pdf');
ahPdf.generatePdf(xmlFilePath, function (err, pdfFileData) {
  // do processing.
});
```