import "../tabris-mock";
import settings from "../../src/model/settings";
import { loadStations } from "../../src/model/server";

describe("Server", function() {

  let data;

  beforeEach(function() {
    settings.serverUrl = "SERVER";
    data = [];
    spyOn(global, "fetch").and.callFake(() => Promise.resolve({ json: () => data }));
  });

  describe("loadStations", function() {

    it("corrects to server URL", function(done) {
      loadStations().then(() => {
        expect(fetch).toHaveBeenCalledWith("SERVER/files/stations");
      }).then(done, done.fail);
    });

    it("handles empty array", function(done) {
      loadStations().then(stations => {
        expect(stations).toEqual([]);
      }).then(done, done.fail);
    });

  });

});
