import {expect} from '../test';
import {mixin, formatTime} from '../../src/model/helpers.js';

describe('helpers', function() {

  describe('mixin', function() {

    it("throws if target doesn't have prototype", function() {
      expect(() => mixin({}, {})).to.throw();
    });

    it('works with plain objects', function() {
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

    it('works with classes', function() {
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

    it('skips constructors', function() {
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

  describe('formatTime', function() {

    it('returns formatted time', function() {
      expect(formatTime(1)).to.equal('0:01');
      expect(formatTime(71)).to.equal('1:11');
      expect(formatTime(671)).to.equal('11:11');
      expect(formatTime(6671)).to.equal('111:11');
    });

    it('returns empty string for illegal values', function() {
      expect(formatTime(0)).to.equal('');
      expect(formatTime(-1)).to.equal('');
      expect(formatTime(NaN)).to.equal('');
    });

    it('accepts input as string', function() {
      expect(formatTime('1')).to.equal('0:01');
    });

  });

});
