import '../tabris-mock.js';
import {expect, stub, restore} from '../test';
import {Tab} from 'tabris';
import settings from '../../src/model/settings';
import StationsTab from '../../src/pages/StationsTab';

describe('StationsTab', function() {

  let data;

  beforeEach(function() {
    settings.server = 'SERVER';
    data = {};
    stub(global, 'fetch', () => Promise.resolve({json: () => data}));
  });

  afterEach(restore);

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

      expect(fetch.calledWith('SERVER/stations')).to.be.ok;
    });

  });

});
