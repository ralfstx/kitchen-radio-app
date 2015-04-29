/* globals fetch: false, Promise: true*/
Promise = require("promise");
require("whatwg-fetch");
var config = require("./config");

require("./player-page.js").create().open();
require("./stations-page.js").create();
require("./albums-page.js").create();

tabris.create("Action", {
  "title": "Stop"
}).on("select", function() {
  fetch(config.server + "/stop");
});

var drawer = tabris.create("Drawer");

tabris.create("PageSelector", {
}).appendTo(drawer);
