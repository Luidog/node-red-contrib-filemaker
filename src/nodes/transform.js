module.exports = function(RED) {
  function transform(configuration) {
    const { transform } = require("fms-api-client");
    const { send, handleError, isJson, constructParameters } = require("../services");
    RED.nodes.createNode(this, configuration);
    const node = this;
    this.status({ fill: "green", shape: "dot", text: "Ready" });
    node.on("input", message => {
      this.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const { data, ...parameters } = constructParameters(
        message,
        configuration,
        node.context(),
        ["data"]
      );
      try {
        if (isJson(data)) {
          send(node, output, message, response)
        } else {
          throw Error("data must be valid json");
        }
      } catch (error) {
        handleError(node, error.message, message);
      }
    });
  }
  RED.nodes.registerType("dapi-transform", transform);
};
