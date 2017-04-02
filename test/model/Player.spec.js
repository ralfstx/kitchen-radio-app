import {startTabris} from '../tabris-mock.js';
import {expect, spy, restore} from '../test';
import settings from '../../src/model/settings';
import services from '../../src/model/services';
import Player from '../../src/model/Player.js';
import Events from '../../src/lib/Events.js';

describe('Player', function() {

  let player;

  beforeEach(function() {
    startTabris();
    settings.serverUrl = 'http://example.org';
    services.wsClient = Object.assign(new Events(), {sendCmd: spy()});
    player = new Player();
  });

  afterEach(restore);

  describe('update', function() {
    it('send ws command status', function() {
      player.update();
      expect(services.wsClient.sendCmd).to.have.been.calledWith('status');
    });
  });

  describe('_updatePlaylist', function() {
    it('send ws command playlist', function() {
      player._updatePlaylist();
      expect(services.wsClient.sendCmd).to.have.been.calledWith('playlist');
    });
  });

  describe('on playlist event', function() {

    let listener;

    beforeEach(function() {
      listener = spy();
      player.on('change:playlist', listener);
    });

    it('triggers event with all fields', function() {
      services.wsClient.trigger('playlist', [{
        album: '03d2fc34',
        name: 'track title',
        disc: '2',
        track: '3',
        time: '100'
      }]);

      expect(listener).to.have.been.calledWith([{
        album: '03d2fc34',
        name: 'track title',
        disc: 2,
        track: 3,
        time: 100
      }]);
    });

    it('leaves out optional fields', function() {
      services.wsClient.trigger('playlist', [{name: 'foo'}]);

      expect(listener).to.have.been.calledWith([{name: 'foo'}]);
    });

    it('skips unknown fields', function() {
      services.wsClient.trigger('playlist', [{name: 'foo', foo: 23}]);

      expect(listener).to.have.been.calledWith([{name: 'foo'}]);
    });

  });

});
