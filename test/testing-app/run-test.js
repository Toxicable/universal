//TODO: this should be TS file with Karma testing
const { renderModuleFactory } = require('@angular/platform-server');
const { enableProdMode } = require('@angular/core');
const fs = require('fs');
require('zone.js/dist/zone-node');

const { AppServerModuleNgFactory } = require(`./dist-server/main.bundle`);
const index = fs.readFileSync('./src/index.html', 'utf8');


function prerender() {
  return renderModuleFactory(AppServerModuleNgFactory, {
    document: index,
    url: '/',
  })
  .then(html => console.log(html))
}

function timePromise(fn) {
  var start = process.hrtime();
  return fn().then(htmlOutput => {
    var [seconds, nanoseconds] = process.hrtime(start);
    return { seconds, nanoseconds };
  })
}


timePromise(() => prerender())
  .then(time => console.log(time))
