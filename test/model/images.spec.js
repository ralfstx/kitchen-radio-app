import "../tabris-mock";
import { getImage } from "../../src/model/images";
import { device } from "tabris";
import { expect } from "chai";
import { stub } from "sinon";

describe("image", function() {

  describe("getImage", function() {

    beforeEach(function() {
      stub(device, "get");
    });

    afterEach(function() {
      device.get.restore();
    });

    it("selects 1 for 1", function() {
      device.get.withArgs("scaleFactor").returns(1);

      expect(getImage("foo")).to.eql({ src: "src/images/foo@1x.png", scale: 1 });
    });

    it("selects 1.5 for 1.5", function() {
      device.get.withArgs("scaleFactor").returns(1.5);

      expect(getImage("foo")).to.eql({ src: "src/images/foo@1.5x.png", scale: 1.5 });
    });

    it("selects 2 for 1.6", function() {
      device.get.withArgs("scaleFactor").returns(1.6);

      expect(getImage("foo")).to.eql({ src: "src/images/foo@2x.png", scale: 2 });
    });

    it("selects 4 for 5", function() {
      device.get.withArgs("scaleFactor").returns(5);

      expect(getImage("foo")).to.eql({ src: "src/images/foo@4x.png", scale: 4 });
    });

  });

});
