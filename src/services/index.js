"use strict";

const _ = require("lodash");

const merge = (message, payload) =>
  Object.assign(message, { payload: payload });

const compact = data => {
  let properties = Array.isArray(data)
    ? _.map(
        data,
        object => (isObject(object) ? discardEmptyProperties(object) : {})
      )
    : isJson(data)
      ? [discardEmptyProperties(data)]
      : [{}];

  return Object.assign({}, ...properties);
};

const discardEmptyProperties = object =>
  _.pickBy(object, property => _.identity(property) || property === false);

const isObject = object => object !== null && typeof object === "object";

/**
 * @method isJson
 * @public
 * @description The isJson method uses the a try / catch to parse incoming data safely as json.
 * This method will return tru if it is able to cast the incoming data as json.
 * @param  {Any} data The data to be evaluated as json.
 * @return {Boolean}      A boolean result depending on if the data passed to it is valid JSON
 */

const isJson = data => {
  data = typeof data !== "string" ? JSON.stringify(data) : data;

  try {
    data = JSON.parse(data);
  } catch (e) {
    return false;
  }

  if (typeof data === "object" && data !== null) {
    return true;
  }

  return false;
};

/**
 * @method parse
 * @public
 * @description parse iterates over an object's values and parses those values as json.
 * @param  {Any} values The value to attempt to parse.
 * @return {Object|Any} A json object or array of objects without the properties passed to it
 */

const parse = object =>
  _.mapValues(object, value => (isJson(value) ? JSON.parse(value) : value));

const sanitizeParameters = (parameters, safeParameters) =>
  _.pick(parameters, safeParameters);

module.exports = { compact, merge, parse, isJson, sanitizeParameters };
