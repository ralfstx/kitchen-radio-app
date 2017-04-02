import {expect} from '../test';
import {shuffle, isObject} from '../../src/lib/util';

describe('util', function() {

  describe('shuffle', function() {

    it('shuffles the given array in place', function() {
      let array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      shuffle(array);
      expect(array).to.not.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('returns shuffled array', function() {
      let array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      expect(shuffle(array)).to.equal(array);
    });

    it('retains all array elements', function() {
      let array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      shuffle(array);
      array.sort();
      expect(array).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

  });

  describe('isObject', function() {

    it('returns true for objects and arrays', function() {
      expect(isObject({})).to.be.true;
      expect(isObject(new Object())).to.be.true;
      expect(isObject(new Date())).to.be.true;
      expect(isObject([])).to.be.true;
    });

    it('returns false for non-objects', function() {
      expect(isObject()).to.be.false;
      expect(isObject(null)).to.be.false;
      expect(isObject(23)).to.be.false;
    });

  });

});
