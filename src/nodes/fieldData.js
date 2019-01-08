module.exports = function(RED) {
  function fieldData(configuration) {
    const { fieldData } = require("fms-api-client");
    const { merge, constructParameters } = require("../services");
    RED.nodes.createNode(this, configuration);
    const node = this;
    node.on("input", message => {
      let { data } = constructParameters(
        message,
        configuration,
        node.context(),
        ["data"]
      );
      try {
        node.send(merge(configuration.output, message, fieldData(data)));
      } catch (error) {
        node.error(error.message, message);
      }
    });
  }
  RED.nodes.registerType("dapi-field-data", fieldData);
};
