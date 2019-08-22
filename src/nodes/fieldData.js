module.exports = function(RED) {
  function fieldData(configuration) {
    const { fieldData } = require("fms-api-client");
    const { send, handleError, constructParameters } = require("../services");
    this.status({ fill: "green", shape: "dot", text: "Ready" });
    RED.nodes.createNode(this, configuration);
    const node = this;
    node.on("input", message => {
      this.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const { data } = constructParameters(
        message,
        configuration,
        node.context(),
        ["data"]
      );
      try {
        send(node, output, message, fieldData(data))
      } catch (error) {
        handleError(node, error.message, message)
      }
    });
  }
  RED.nodes.registerType("dapi-field-data", fieldData);
};
