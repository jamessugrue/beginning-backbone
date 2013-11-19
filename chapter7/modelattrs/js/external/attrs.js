// v0.0.1

// ==========================================
// Copyright 2013 Dataminr
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// work derived from https://github.com/twitter/flight/blob/master/lib/advice.js
// ==========================================


var toAttrs = function(model) {

  binder = function(key) {
    return function(val, options) {
      if (arguments.length > 0) {
        model.set(key, val, options);
        return this;
      }
      return model.get(key);
    };
  };

  var ret = {};

  _.each(model.attributes, function(val, key) {
    ret[key] = binder(key);
  });

  return ret;
};