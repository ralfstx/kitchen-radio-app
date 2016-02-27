import { Album, Disc, Track } from "../../src/model/album.js";

describe("Album", function() {

  let album;

  describe("when created without parameters", function() {

    it("throws error", function() {
      expect(() => {
        album = new Album();
      }).toThrow();
    });

  });

  describe("when created without data", function() {

    beforeEach(function() {
      album = new Album('URL');
    });

    it("string fields are empty", function() {
      expect(album.title).toBe('');
      expect(album.artist).toBe('');
    });

    it("discs and tracks are emtpy", function() {
      expect(album.discs).toEqual([]);
      expect(album.tracks).toEqual([]);
    });

    it("coverUrl includes url", function() {
      expect(album.coverUrl).toMatch(/^URL/);
    });

  });

  describe("when created with single-disc data", function() {

    beforeEach(function() {
      album = new Album('URL', {
        "name": "Pink Floyd - Animals",
        "title": "Animals",
        "artist": "Pink Floyd",
        "tracks": [{
          "path": "01.ogg",
          "title": "Pigs On The Wing (Part One)",
          "length": 85
        }, {
          "path": "02.ogg",
          "title": "Dogs",
          "length": 1024
        }, {
          "path": "03.ogg",
          "title": "Pigs (Three Different Ones)",
          "length": 682
        }, {
          "path": "04.ogg",
          "title": "Sheep",
          "length": 624
        }, {
          "path": "05.ogg",
          "title": "Pigs On The Wing (Part Two)",
          "length": 85
        }]
      });
    });

    it("contains name, title and artist", function() {
      expect(album.name).toBe('Pink Floyd - Animals');
      expect(album.title).toBe('Animals');
      expect(album.artist).toBe('Pink Floyd');
    });

    it("contains single disc", function() {
      expect(album.discs.length).toBe(1);
      expect(album.discs[0]).toEqual(jasmine.any(Disc));
    });

    it("disc contains album", function() {
      expect(album.discs[0].album).toBe(album);
    });

    it("disc contains number", function() {
      expect(album.discs[0].number).toBe(1);
    });

    it("disc contains url", function() {
      expect(album.discs[0].url).toBe("URL");
    });

    it("contains all tracks", function() {
      expect(album.tracks.length).toBe(5);
      expect(album.tracks[0]).toEqual(jasmine.any(Track));
    });

    it("track contains album", function() {
      expect(album.tracks[0].album).toBe(album);
    });

    it("track contains disc", function() {
      expect(album.tracks[0].disc).toBe(album.discs[0]);
    });

    it("track contains number", function() {
      expect(album.tracks[2].number).toBe(3);
    });

    it("track contains url", function() {
      expect(album.tracks[0].url).toBe("URL/01.ogg");
    });

    it("coverUrl includes url", function() {
      expect(album.coverUrl).toMatch(/^URL/);
    });

  });

});
