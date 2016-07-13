DH-AH-PDF
====================================================================
____________________________________________________________________

This is a node module that allows you to create PDF files using xml or fo files.
This module uses the Antenna House AHFormatter tool.

## System Requirements

    This module currently only works on linux.

## Setup

- If you want to add your own logger to the module, you can use the setLogger function. Note: this assumes your logger has 3 function (info, warn, error). If any of those functions are not present, it will default to logging to the console.

    var ahPdf = require('dh-ah-pdf');
    ahPdf.setLogger(logger);

## Create a PDF:

1) Create a PDF from an xml or FO file:

    var ahPdf = require('dh-ah-pdf');
    ahPdf.generatePdf(xmlFilePath, function (err, pdfFileData) {
      // do processing.
    });

