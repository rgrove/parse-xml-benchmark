'use strict';

const fs = require('fs');
const os = require('os');

const { version: libxmljs2Version } = require('libxmljs2/package.json');
const { version: parseXmlVersion } = require('@rgrove/parse-xml/package.json');
const { version: xmldocVersion } = require('xmldoc/package.json');
const benny = require('benny');
const libxmljs2 = require('libxmljs2');
const parseXml = require('@rgrove/parse-xml');
const xmldoc = require('xmldoc');

const suites = [
  {
    name: 'Small document',
    filename: `${__dirname}/fixtures/small.xml`
  },

  {
    name: 'Medium document',
    filename: `${__dirname}/fixtures/medium.xml`
  },

  {
    name: 'Large document',
    filename: `${__dirname}/fixtures/large.xml`
  }
];

console.log(`Node.js ${process.version} / ${os.type()} ${os.arch()}\n${os.cpus()[0].model}\n`);

for (let { filename, name } of suites) {
  let xml = fs.readFileSync(filename, 'utf8');

  benny.suite(
    `${name} (${xml.length} bytes)`,

    benny.add(`@rgrove/parse-xml ${parseXmlVersion}`, () => {
      parseXml(xml);
    }),

    benny.add(`libxmljs2 ${libxmljs2Version} (native)`, () => {
      libxmljs2.parseXmlString(xml);
    }),

    benny.add(`xmldoc ${xmldocVersion} (sax-js)`, () => {
      new xmldoc.XmlDocument(xml);
    }),

    benny.cycle(),
    benny.complete(),
    benny.complete(() => console.log())
  );
}
