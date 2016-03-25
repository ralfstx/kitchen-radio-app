import { splice, mixin } from "../../src/model/helpers.js";
import { expect } from "chai";

describe("helpers", function() {

  describe("splice", function() {

    it("throws with columns = 0", function() {
      expect(() => splice([], 0)).to.throw();
    });

    it("fails with negative # of columns", function() {
      expect(() => splice([], -1)).to.throw();
    });

    describe("with 1 col,", function() {

      it("empty array", function() {
        expect(splice([], 1)).to.eql([]);
      });

      it("1 element", function() {
        expect(splice([1], 1)).to.eql([[1]]);
      });

      it("2 elements", function() {
        expect(splice([1, 2], 1)).to.eql([[1], [2]]);
      });

    });

    describe("with 2 col (default),", function() {

      it("empty array", function() {
        expect(splice([])).to.eql([]);
      });

      it("1 element", function() {
        expect(splice([1])).to.eql([[1]]);
      });

      it("2 elements", function() {
        expect(splice([1, 2])).to.eql([[1, 2]]);
      });

      it("3 elements", function() {
        expect(splice([1, 2, 3])).to.eql([[1, 2], [3]]);
      });

    });

    describe("with 3 cols,", function() {

      it("empty array", function() {
        expect(splice([], 3)).to.eql([]);
      });

      it("3 elements", function() {
        expect(splice([1, 2, 3], 3)).to.eql([[1, 2, 3]]);
      });

      it("4 elements", function() {
        expect(splice([1, 2, 3, 4], 3)).to.eql([[1, 2, 3], [4]]);
      });

    });

  });

  describe("mixin", function() {

    it("throws if target doesn't have prototype", function() {
      expect(() => mixin({}, {})).to.throw();
    });

    it("works with plain objects", function() {
      class Target {}
      let Mixin = {
        get foo() { return this._foo * 2; },
        set foo(value) { this._foo = value + 1; }
      };

      mixin(Target, Mixin);

      let target = new Target();
      target.foo = 23;
      expect(target.foo).to.equal(48);
    });

    it("works with classes", function() {
      class Target {}
      class Mixin {
        get foo() { return this._foo * 2; }
        set foo(value) { this._foo = value + 1; }
      }

      mixin(Target, Mixin);

      let target = new Target();
      target.foo = 23;
      expect(target.foo).to.equal(48);
    });

    it("skips constructors", function() {
      class Target {
        constructor() { this._foo = 23; }
      }
      class Mixin {
        constructor() { this._foo = 24; }
        get foo() { return this._foo; }
      }

      mixin(Target, Mixin);

      let target = new Target();
      expect(target.foo).to.equal(23);
    });

  });

});
