import { splice } from "../../src/model/helpers.js";

describe("helpers", function() {

  describe("splice", function() {

    it("throws with columns = 0", function() {
      expect(() => splice([], 0)).toThrow();
    });

    it("fails with negative # of columns", function() {
      expect(() => splice([], -1)).toThrow();
    });

    describe("with 1 col,", function() {

      it("empty array", function() {
        expect(splice([], 1)).toEqual([]);
      });

      it("1 element", function() {
        expect(splice([1], 1)).toEqual([[1]]);
      });

      it("2 elements", function() {
        expect(splice([1, 2], 1)).toEqual([[1], [2]]);
      });

    });

    describe("with 2 col (default),", function() {

      it("empty array", function() {
        expect(splice([])).toEqual([]);
      });

      it("1 element", function() {
        expect(splice([1])).toEqual([[1]]);
      });

      it("2 elements", function() {
        expect(splice([1, 2])).toEqual([[1, 2]]);
      });

      it("3 elements", function() {
        expect(splice([1, 2, 3])).toEqual([[1, 2], [3]]);
      });

    });

    describe("with 3 cols,", function() {

      it("empty array", function() {
        expect(splice([], 3)).toEqual([]);
      });

      it("3 elements", function() {
        expect(splice([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
      });

      it("4 elements", function() {
        expect(splice([1, 2, 3, 4], 3)).toEqual([[1, 2, 3], [4]]);
      });

    });

  });

});
