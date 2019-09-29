module.exports = function(RED) {
  function fieldData(config) {
    const { fieldData } = require("fms-api-client");
    const { send, handleError, constructParameters } = require("../services");
    const { output } = config;

    RED.nodes.createNode(this, config);

    const node = this;

    node.status({ fill: "green", shape: "dot", text: "Ready" });

    node.on("input", message => {
      node.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const { data } = constructParameters(message, config, node.context(), [
        "data"
      ]);
      try {
        send(node, output, message, fieldData(data));
      } catch (error) {
        handleError(node, error.message, message);
      }
    });
  }
  RED.nodes.registerType("dapi-field-data", fieldData);
};
