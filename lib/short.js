/**
 * @list dependencies
 */

var ID = require('short-id'),
  mongoose = require('mongoose'),
  ShortURL = require('../models/ShortURL').ShortURL;

/**
 * @configure short-id
 */

ID.configure({
  length: 6,
  algorithm: 'sha1',
  salt: Math.random
});

/**
 * @method connect
 * @param {String} mongdb Mongo DB String to connect to
 */

exports.connect = function(mongodb) {
  mongoose.connect(mongodb);
  exports.connection = mongoose.connection;
};

/**
 * @method generate
 * @param {Object} options Must at least include a `URL` attribute
 */

exports.generate = function(document, next) {
  var generatedHash = ID.store(document.URL),
      query = { URL : document.URL };

  document.hash = generatedHash;
  document.data = !!document.data ? document.data : null;

  ShortURL.findOrCreate(query, document, {}, function (error, ShortURLObject) {
    if (error) {
      return next(error);
    }

    next(null, ShortURLObject);
  });

};

/**
 * @method retrieve
 * @param {Object} options Must at least include a `hash` attribute
 */

exports.retrieve = function(hash, next) {
  var query = { hash : hash },
      update = { $inc: { hits: 1 } },
      options = { multi: true };


  ShortURL.findOne(query, function (error, ShortURLObject) {
    if (error) {
      return next(error);
    }

    if (ShortURLObject && ShortURLObject !== null) {
      next(null, ShortURLObject);
    } else {
      next(new Error('MongoDB - Cannot find Document'));
    }

  });

  ShortURL.update( query, update , options , function (){ } );

};

/**
 * @method hits
 * @param {Object} options Must at least include a `hash` attribute
 */

exports.hits = function (hash, next) {
  var query = { hash : hash },
      options = { multi: true };

  ShortURL.findOne(query, function(error, ShortURLObject) {
    if (error) {
      return next(error);
    }

    if (ShortURLObject && ShortURLObject !== null) {
      next(null, ShortURLObject.hits);
    } else {
      next(new Error('MongoDB - Cannot find Document'));
    }

  });

};

/**
 * @method list
 * @description List all Shortened URLs
 */

exports.list = function (next) {
  ShortURL.find({}, next);
};
