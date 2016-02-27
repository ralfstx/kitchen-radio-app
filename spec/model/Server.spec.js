import config from "../../src/config";

describe("Server", function() {

  let data;

  beforeEach(function() {
    config.server = "SERVER";
    data = {};
    spyOn(global, "fetch").and.returnValue(Promise.resolve({ json: () => data }));
  });

  describe("create", function() {

    beforeEach(function() {

    });

    it("works", function() {
      expect(true).toBe(true);
    });

  });

});
