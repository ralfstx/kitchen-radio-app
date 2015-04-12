require("./tabris-mock.js");
var $ = require("../src/lib/jquery.min.js");
var config = require("../src/config");
var stationsPage = require("../src/stations-page.js");

describe("stations-page:", function() {

  beforeEach(function() {
    config.server = "SERVER";
  });

  describe("create", function() {

    var page;

    beforeEach(function() {
      spyOn($, "getJSON");
      page = stationsPage.create();
    });

    it("creates a page", function() {
      expect(page).toEqual(jasmine.any(tabris.Page));
    });

    it("requests stations", function() {
      expect($.getJSON).toHaveBeenCalledWith("SERVER/files/stations", jasmine.any(Function));
    });

  });

});
