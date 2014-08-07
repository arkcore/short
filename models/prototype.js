
/**
 * @description wrapper for models to return promises versus executing immediately
 */

exports.Model = function (mongooseModel) {
  this.baseModel = mongooseModel;
};

/**
 * @method find
 * @description wraps mongodb find with a promise
 */

exports.Model.prototype.find = function () {
  this.baseModel.find.apply(this.baseModel, arguments);
};

/**
 * @method findOne
 * @description wraps mongodb findOne with a promise
 */

exports.Model.prototype.findOne = function () {
  this.baseModel.findOne.apply(this.baseModel, arguments);
};

/**
 * @method update
 * @description wraps mongodb update with a promise
 */

exports.Model.prototype.update = function () {
  this.baseModel.update.apply(this.baseModel, arguments);
};

/**
 * @method create
 * @description wraps mongodb create with a promise
 */

exports.Model.prototype.create = function(data, next) {

  this.baseModel.create(data, function(error, result) {
    if (error) {
      if (error.message && error.message.match(/E11000/i)) {
        next(new Error('Duplicate Key Error'));
      } else {
        next(error);
      }
    } else {
      next(null, result);
    }
  });
};

/**
 * @method findOrCreate
 * @description searches for a document, otherwise creates it.
 */

exports.Model.prototype.findOrCreate = function(query, document, options, next) {
  var baseModel = this;

  baseModel.findOne(query, function(error, result) {
    if (error) {
      next(error);
    } else {
      if (result && result !== null) {
        next(null, result);
      } else {
        baseModel.create(document, next);
      }
    }
  });
};
