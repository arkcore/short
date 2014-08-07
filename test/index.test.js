
/**
 * @list dependencies
 */

var vows = require('vows'),
    assert = require('assert'),
    mongoose = require('mongoose'),
    short = require('../lib/short');

mongoose.set('debug', true);

/**
 * @description connect to mongodb
 */

short.connect('mongodb://localhost/short');

/**
 * @description add suites to vows
 */

vows.describe('general module tests').addBatch({

  'when instantiating short':{
    topic: function(){
      return short;
    },
    'short should be an object': function(topic) {
      assert.isObject(topic);
    },
  },

  'when creating a short url and then retrieving it':{
    topic:function() {
      var context = this;
      short.generate({ URL : 'http://nodejs.org/'}, function (error, ShortURLObject) {
        if (error) {
          return context.callback(error, null);
        }

        var hash = ShortURLObject.hash;
        short.retrieve(hash, context.callback);
      });
    },
    'there should be no errors':function(error, ShortURLObject) {
      assert.isNull(error);
    },
    'shortURL should be defined':function(error, ShortURLObject) {
      assert.isNotNull(ShortURLObject);
    },
    'shortURL should be an object':function(error, ShortURLObject) {
      assert.isObject(ShortURLObject);
    },
    'and shortURL.URL should be "http://nodejs.org/"':function(error, ShortURLObject) {
      assert.equal(ShortURLObject.URL, 'http://nodejs.org/');
    }
  },

  'when .list()ing Shortened URLs':{
    topic: function() {
      var context = this;
      short.list(context.callback);
    },
    'there should be no errors':function(error, URLs) {
      assert.isNull(error);
    },
    'URLs should be defined':function(error, URLs){
      assert.isNotNull(URLs);
    },
    'and URLs should be an array of objects':function(error, URLs) {
      assert.isArray(URLs);
    }
  }

}).export(module);
