import "../tabris-mock.js";
import settings from "../../src/model/settings";
import StationsPage from "../../src/pages/StationsPage.js";
import { Page } from "tabris";

describe("StationsPage", function() {

  beforeEach(function() {
    settings.server = "SERVER";
    spyOn(global, "fetch").and.returnValue(Promise.resolve({
      json: () => ({
      })
    }));
  });

  describe("create", function() {

    let page;

    beforeEach(function() {
      page = new StationsPage();
    });

    it("creates a page", function() {
      expect(page).toEqual(jasmine.any(Page));
    });

    it("does not make any requests", function() {
      expect(fetch).not.toHaveBeenCalled();
    });

    it("requests stations on load", function() {
      page.load();

      expect(fetch).toHaveBeenCalledWith("SERVER/files/stations");
    });

  });

});
