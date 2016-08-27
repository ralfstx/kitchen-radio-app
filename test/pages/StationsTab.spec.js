import '../tabris-mock.js';
import settings from '../../src/model/settings';
import StationsTab from '../../src/pages/StationsTab';
import {Tab} from 'tabris';
import {expect} from 'chai';
import {stub} from 'sinon';

describe('StationsTab', function() {

  let data;

  beforeEach(function() {
    settings.server = 'SERVER';
    data = {};
    stub(global, 'fetch', () => Promise.resolve({json: () => data}));
  });

  afterEach(function() {
    fetch.restore();
  });

  describe('create', function() {

    let tab;

    beforeEach(function() {
      tab = new StationsTab();
    });

    it('creates a tab', function() {
      expect(tab).to.be.instanceof(Tab);
    });

    it('does not make any requests', function() {
      expect(fetch.called).not.to.be.ok;
    });

    it('requests stations on load', function() {
      tab.load();

      expect(fetch.calledWith('SERVER/files/stations')).to.be.ok;
    });

  });

});
