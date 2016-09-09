import {expect} from '../test';
import {mixin} from '../../src/model/helpers.js';

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

});
