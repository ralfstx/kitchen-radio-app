import "../tabris-mock.js";
import settings from "../../src/model/settings";
import StationsPage from "../../src/pages/StationsPage.js";
import { Page } from "tabris";
import { expect } from "chai";
import { stub } from "sinon";

describe("StationsPage", function() {

  let data;

  beforeEach(function() {
    settings.server = "SERVER";
    data = {};
    stub(global, "fetch", () => Promise.resolve({ json: () => data }));
  });

  afterEach(function() {
    fetch.restore();
  });

  describe("create", function() {

    let page;

    beforeEach(function() {
      page = new StationsPage();
    });

    it("creates a page", function() {
      expect(page).to.be.instanceof(Page);
    });

    it("does not make any requests", function() {
      expect(fetch.called).not.to.be.ok;
    });

    it("requests stations on load", function() {
      page.load();

      expect(fetch.calledWith("SERVER/files/stations")).to.be.ok;
    });

  });

});
