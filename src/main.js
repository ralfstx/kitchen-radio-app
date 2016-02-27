/* globals fetch: false, Promise: true*/

Promise = require("promise");
require("whatwg-fetch");

let config = require("./config");

require("./player-page.js").create().open();
require("./stations-page.js").create();
require("./albums-page.js").create();

new tabris.Action({
  "title": "Stop"
}).on("select", () => {
  fetch(config.server + "/stop");
});

new tabris.Drawer().append(new tabris.PageSelector());
