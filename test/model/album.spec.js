import {expect} from 'chai';
import {Album, Disc, Track} from '../../src/model/album.js';

describe('Album', function() {

  let album;

  describe('when created without parameters', function() {

    it('throws error', function() {
      expect(() => {
        album = new Album();
      }).to.throw();
    });

  });

  describe('when created without data', function() {

    beforeEach(function() {
      album = new Album('URL');
    });

    it('string fields are empty', function() {
      expect(album.title).to.equal('');
      expect(album.artist).to.equal('');
    });

    it('discs and tracks are emtpy', function() {
      expect(album.discs).to.eql([]);
      expect(album.tracks).to.eql([]);
    });

  });

  describe('when created with single-disc data', function() {

    beforeEach(function() {
      album = new Album('URL', {
        'name': 'Pink Floyd - Animals',
        'title': 'Animals',
        'artist': 'Pink Floyd',
        'tracks': [{
          'path': '01.ogg',
          'title': 'Pigs On The Wing (Part One)',
          'length': 85
        }, {
          'path': '02.ogg',
          'title': 'Dogs',
          'length': 1024
        }, {
          'path': '03.ogg',
          'title': 'Pigs (Three Different Ones)',
          'length': 682
        }, {
          'path': '04.ogg',
          'title': 'Sheep',
          'length': 624
        }, {
          'path': '05.ogg',
          'title': 'Pigs On The Wing (Part Two)',
          'length': 85
        }]
      });
    });

    it('contains name, title and artist', function() {
      expect(album.name).to.equal('Pink Floyd - Animals');
      expect(album.title).to.equal('Animals');
      expect(album.artist).to.equal('Pink Floyd');
    });

    it('contains single disc', function() {
      expect(album.discs.length).to.equal(1);
      expect(album.discs[0]).to.be.an.instanceof(Disc);
    });

    it('disc contains album', function() {
      expect(album.discs[0].album).to.equal(album);
    });

    it('disc contains number', function() {
      expect(album.discs[0].number).to.equal(1);
    });

    it('disc contains url', function() {
      expect(album.discs[0].url).to.equal('URL');
    });

    it('contains all tracks', function() {
      expect(album.tracks.length).to.equal(5);
      expect(album.tracks[0]).to.be.an.instanceof(Track);
    });

    it('track contains album', function() {
      expect(album.tracks[0].album).to.equal(album);
    });

    it('track contains disc', function() {
      expect(album.tracks[0].disc).to.equal(album.discs[0]);
    });

    it('track contains number', function() {
      expect(album.tracks[2].number).to.equal(3);
    });

    it('track contains url', function() {
      expect(album.tracks[0].url).to.equal('URL/01.ogg');
    });

  });

});
