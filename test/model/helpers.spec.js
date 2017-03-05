import {expect} from '../test';
import {formatTime} from '../../src/model/helpers.js';

describe('helpers', function() {

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
