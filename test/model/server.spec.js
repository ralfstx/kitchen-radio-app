import {startTabris} from '../tabris-mock';
import {expect, stub, restore} from '../test';
import settings from '../../src/model/settings';
import {loadAlbum, loadStations} from '../../src/model/server';

describe('Server', function() {

  let data;

  beforeEach(function() {
    startTabris();
    settings.serverUrl = 'SERVER';
    data = [];
    stub(global, 'fetch', () => Promise.resolve({ok: true, json: () => data}));
  });

  afterEach(restore);

  describe('loadAlbum', function() {

    it('connects to server URL', function() {
      return loadAlbum('23').then(() => {
        expect(fetch).to.have.been.calledWith('SERVER/albums/23');
        expect(fetch).to.have.been.calledOnce;
      });
    });

    it('returns Album with correct URL and data', function() {
      data = {name: 'Album Name'};
      return loadAlbum(23).then(album => {
        expect(album.url).to.eql('/albums/23');
        expect(album.name).to.eql('Album Name');
      });
    });

  });

  describe('loadStations', function() {

    it('connects to server URL', function() {
      return loadStations().then(() => {
        expect(fetch).to.have.been.calledWith('SERVER/stations');
        expect(fetch).calledOnce;
      });
    });

    it('handles empty array', function() {
      return loadStations().then(stations => {
        expect(stations).to.eql([]);
      });
    });

  });

});
