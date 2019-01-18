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

const merge = (property, message, payload) =>
  isJson(message[property])
    ? _.set(message, property, Object.assign(message[property], payload))
    : _.set(message, property, payload);

/**
 * @method castBooleans
 * @public
 * @description traverses an object and casts all "true" and "false" strings as the appropriate boolean type.
 * @param  {Object} object  The object to map for true and false strings.
 * @return {Object} an object with true and false strings mapped to their boolean counterparts.
 */

const castBooleans = object =>
  _.mapValues(
    object,
    (value, key, index) =>
      value === "true" || value === "false" ? value === "true" : value
  );

/**
 * @method constructParameters
 * @public
 * @description composes a object from the values defined in the values parameter. It will
 * traverse the incoming node message, the node's configuration, and the current context to
 * construct the appopriate parameters based on the values passed to it.
 * @param  {Object} message  The incoming message recieved by the node.
 * @param  {Object} configuration  The current node's configuration.
 * @param  {Object} context  The node's current context.
 * @param  {Array} values  An array of allowed values.
 * @return {Object} an object with true and false strings mapped to their boolean counterparts.
 */

const constructParameters = (message, configuration, context, values) =>
  compact(
    _.map(values, value => {
      let parameter = {};
      let type = configuration[`${value}Type`];
      if (type && type !== "msg" && type !== "flow" && type !== "global") {
        parameter = { [value]: parseJson(configuration[value]) };
      } else if (type === "msg") {
        parameter = {
          [value]: _.get(message, parseJson(configuration[value]), "")
        };
      } else if (type === "flow") {
        parameter = {
          [value]: context.flow.get(configuration[value])
        };
      } else if (type === "global") {
        parameter = {
          [value]: context.global.get(configuration[value])
        };
      }
      return parameter;
    })
  );

/**
 * @method parseJson
 * @public
 * @description checks if the passed parameter is valid json. If the value is not json it is
 * returned without modification. If the parameter is json it is parsed and returned.
 * @param  {Any} values The value to attempt to parse.
 * @return {Any|Object} a parsed json object or the original value.
 */

const parseJson = value => (isJson(value) ? JSON.parse(value) : value);

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
 * @param  {Object} object The object to be evaluated and modified.
 * @return {Object} an object with only properties that are not null, undefined, or an empty string.
 */

const discardEmpty = object =>
  _.pickBy(object, property => _.identity(property) || property === false);

/**
 * @method isObject
 * @public
 * @description The isObject function tests incoming data to see if it is null or an object.
 * @param  {Any} value The data to check
 * @return {Boolean} A boolean result depending on if the data passed to it is an object
 */

const isObject = value => value !== null && typeof value === "object";

/**
 * @method isJson
 * @public
 * @description The isJson function uses tests the incoming value to see if
 * it is json or a string. This function will than attempt to parse the
 * incoming value. If parsing fails it will return false. If the resulting
 * value is not an object or is null it will return false, otherwise true.
 * @param  {Any} value The value to be evaluated as json.
 * @return {Boolean}      A boolean result depending on if the value passed to it is valid JSON
 */

const isJson = value => {
  value = typeof value !== "string" ? JSON.stringify(value) : value;

  try {
    value = JSON.parse(value);
  } catch (e) {
    return false;
  }

  return isObject(value) ? true : false;
};

/**
 * @method sanitize
 * @public
 * @description picks only the properties passed to it from the object it recieves.
 * @param  {Object} object The object to use when picking properties.
 * @param  {Array} properties An array of properties to pick.
 * @return {Object} A json object with only the properties specified.
 */

const sanitize = (object, properties) => _.pick(object, properties);

module.exports = {
  compact,
  merge,
  isJson,
  sanitize,
  constructParameters,
  castBooleans
};
