# image-to-pdf
Super tiny Node.js application able to convert image(s) into a PDF using google's [Puppeteer](https://github.com/puppeteer/puppeteer/)

It is in no way a production ready command line tool! Still... quite useful if your printer/scanner is not able to create PDF files by itself...

## Prerequisites
- Node.js (tested using version 13.13)

## How to run
1. npm install
2. node index.js OR npm run run

## Available arguments
- '-s' / '--sort': If given with value 'name' the input files will by sorted by name (alphabetic and numeric)
- '-o' / '--output': Name of output file (.pdf)
- '-i' / '--input': Name(s) of files / images to convert
- '-f' / '--format': Format of PDF (see [Puppeteer API](https://pptr.dev/#?product=Puppeteer&version=v3.0.0&show=api-pagepdfoptions))

## Example

    node index.js -i myScannedImage-1.png myScannedImage-3.png myScannedImage-2.png -s name -o myScannedDocument.pdf
