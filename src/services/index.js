"use strict";

const _ = require("lodash");

const merge = (message, payload) => Object.assign(message, payload);

const compact = objects =>
  Object.assign(
    ...arguments.map(
      object =>
        isObject(object) ? _.pickBy(object, datum => !_.isEmpty(datum)) : {}
    )
  );

const isObject = object => object !== null && typeof object === "object";

module.exports = { compact, merge };
