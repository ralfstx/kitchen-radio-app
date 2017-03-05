import {startTabris} from '../tabris-mock';
import {expect, restore} from '../test';
import {getImage} from '../../src/model/images';

describe('image', function() {

  describe('getImage', function() {

    let client;

    beforeEach(function() {
      client = startTabris();
    });

    afterEach(restore);

    it('selects 1 for 1', function() {
      client.fakeDevice({scaleFactor: 1});

      expect(getImage('foo')).to.eql({src: 'src/images/foo@1x.png', scale: 1});
    });

    it('selects 1.5 for 1.5', function() {
      client.fakeDevice({scaleFactor: 1.5});

      expect(getImage('foo')).to.eql({src: 'src/images/foo@1.5x.png', scale: 1.5});
    });

    it('selects 2 for 1.6', function() {
      client.fakeDevice({scaleFactor: 1.6});

      expect(getImage('foo')).to.eql({src: 'src/images/foo@2x.png', scale: 2});
    });

    it('selects 4 for 5', function() {
      client.fakeDevice({scaleFactor: 5});

      expect(getImage('foo')).to.eql({src: 'src/images/foo@4x.png', scale: 4});
    });

  });

});
