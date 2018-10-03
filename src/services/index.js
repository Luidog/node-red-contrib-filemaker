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
    : discardEmptyProperties(data) || {};
    
  return Object.assign({}, ...properties);
};

const discardEmptyProperties = object => _.pickBy(object, _.identity);

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
  try {
    JSON.parse(data);
  } catch (e) {
    return false;
  }
  return true;
};

/**
 * @method parse
 * @public
 * @description parse performs a try catch before attempting to parse the value as json. If the value is not valid json it wil return the value.
 * @param  {Any} values The value to attempt to parse.
 * @return {Object|Any} A json object or array of objects without the properties passed to it
 */

const parse = object =>
  _.mapValues(object, value => (isJson(value) ? JSON.parse(value) : value));

module.exports = { compact, merge, parse };
