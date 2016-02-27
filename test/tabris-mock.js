/*global window: true */

if (typeof window === "undefined") {
  window = global;
}

require("tabris");

let ClientSpy = function() {
};

ClientSpy.prototype = {

  create: function() {
  },

  get: function() {
  },

  set: function() {
  },

  call: function() {
  },

  listen: function() {
  },

  destroy: function() {
  }

};

tabris._init(new ClientSpy());
