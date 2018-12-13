"use strict";

const _ = require("lodash");

/**
 * @method merge
 * @private
 * @description merges the objects recieved into a single object. This function will nest the second
 * parameter sent to it in a payload property.
 * @param  {Object} message The original message object.
 * @param  {Object} payload The object that should be nested into a payload property.
 * @return {Object} An object with only properties that are not null, undefined, or an empty string.
 */

const merge = (message, property, payload) =>
  Object.assign(message, { [property]: payload });

/**
 * @method compact
 * @private
 * @description merges properties from an array of objects together while also discarding properties
 * with null, empty string, or undefined values. If a non json value is passed to this function it is
 * discarded.
 * @see discardEmpty
 * @param  {Object|Array} data The array of objects or single object to compact into one object.
 * @return {Object} An object with only properties that are not null, undefined, or an empty string.
 */

const compact = data => {
  let properties = Array.isArray(data)
    ? _.map(data, object => (isObject(object) ? discardEmpty(object) : {}))
    : isJson(data)
      ? [discardEmpty(data)]
      : [{}];

  return Object.assign({}, ...properties);
};

/**
 * @method discardEmpty
 * @private
 * @description discard properties that are null, an empty string or undefined.
 * @param  {Object} data The data to be evaluated as json.
 * @return {Object} an object with only properties that are not null, undefined, or an empty string.
 */

const discardEmpty = object =>
  _.pickBy(object, property => _.identity(property) || property === false);

/**
 * @method isObject
 * @public
 * @description The isObject function tests incoming data to see if it is null or an object.
 * @param  {Any} data The data to check
 * @return {Boolean}      A boolean result depending on if the data passed to it is an object
 */

const isObject = data => data !== null && typeof data === "object";

/**
 * @method isJson
 * @public
 * @description The isJson function uses tests the incoming data to see if
 * it is json or a string. This function will than attempt to parse the
 * incoming data. If parsing fails it will return false. If the resulting
 * data is not an object or is null it will return false, otherwise true.
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

  return isObject(data) ? true : false;
};

/**
 * @method sanitizeParameters
 * @public
 * @description selects only the parameters sent specified from the incoming paraeters
 * @param  {Object} values The value to attempt to parse.
 * @param  {Array} safeParameters an array of parameters that are safe to be included in the result
 * @return {Object} A json object with only the parameters passed to it.
 */

const sanitize = (data, parameters) => _.pick(data, parameters);

module.exports = { compact, merge, isJson, sanitize };
