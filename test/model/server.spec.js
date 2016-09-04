import '../tabris-mock';
import settings from '../../src/model/settings';
import {loadStations} from '../../src/model/server';
import {expect} from 'chai';
import {stub} from 'sinon';

describe('Server', function() {

  let data;

  beforeEach(function() {
    settings.serverUrl = 'SERVER';
    data = [];
    stub(global, 'fetch', () => Promise.resolve({json: () => data}));
  });

  afterEach(function() {
    fetch.restore();
  });

  describe('loadStations', function() {

    it('corrects to server URL', function(done) {
      loadStations().then(() => {
        expect(fetch.calledWith('SERVER/stations')).to.be.ok;
        expect(fetch.calledOnce).to.be.ok;
      }).then(done, done);
    });

    it('handles empty array', function(done) {
      loadStations().then(stations => {
        expect(stations).to.eql([]);
      }).then(done, done);
    });

  });

});
