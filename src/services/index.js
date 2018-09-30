"use strict";

const _ = require("lodash");

const merge = (message, payload) =>
  Object.assign(message, { payload: payload });

const compact = data =>
  Object.assign(
    Array.isArray(data)
      ? data.reduce(
          object => (isObject(object) ? discardEmptyProperties(object) : {})
        )
      : discardEmptyProperties(object) || {}
  );

const discardEmptyProperties = object =>
  _.pickBy(object, datum => !_.isEmpty(datum));

const isObject = object => object !== null && typeof object === "object";

module.exports = { compact, merge };
