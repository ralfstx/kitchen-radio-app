import {expect, fetch_mock, restore} from '../test';
import settings from '../../src/model/settings';
import Player from '../../src/model/Player.js';

describe('Player', function() {

  let player;

  beforeEach(function() {
    settings.serverUrl = 'http://example.org';
    player = new Player();
  });

  afterEach(restore);

  describe('playlist', function() {

    it('works', function() {
      fetch_mock('*', [{
        file: 'http://example.org/albums/03d2fc34/discs/2/tracks/3'
      }]);
      return player.playlist().then(res => {
        expect(res).to.eql([{
          album: '03d2fc34',
          disc: 2,
          track: 3
        }]);
      });
    });

  });

});
