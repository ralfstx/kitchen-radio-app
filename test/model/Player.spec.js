import {startTabris} from '../tabris-mock.js';
import {expect, fetch_mock, restore} from '../test';
import settings from '../../src/model/settings';
import Player from '../../src/model/Player.js';

describe('Player', function() {

  let player;

  beforeEach(function() {
    startTabris();
    settings.serverUrl = 'http://example.org';
    player = new Player();
  });

  afterEach(restore);

  describe('playlist', function() {

    it('contains all response fields', function() {
      fetch_mock('*', [{
        album: '03d2fc34',
        name: 'track title',
        disc: '2',
        track: '3',
        time: '100'
      }]);
      return player.playlist().then(res => {
        expect(res).to.eql([{
          album: '03d2fc34',
          name: 'track title',
          disc: 2,
          track: 3,
          time: 100
        }]);
      });
    });

    it('leaves out optional fields', function() {
      fetch_mock('*', [{name: 'foo'}]);
      return player.playlist().then(res => {
        expect(res).to.eql([{name: 'foo'}]);
      });
    });

    it('skips unknown fields', function() {
      fetch_mock('*', [{name: 'foo', foo: 23}]);
      return player.playlist().then(res => {
        expect(res).to.eql([{name: 'foo'}]);
      });
    });

  });

});
