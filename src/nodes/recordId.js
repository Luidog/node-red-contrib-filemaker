module.exports = function(RED) {
  function recordId(config) {
    const { recordId } = require("fms-api-client");
    const { send, handleError, constructParameters } = require("../services");

    const { output, ...configuration } = config;

    RED.nodes.createNode(this, config);

    const node = this;

    node.status({ fill: "green", shape: "dot", text: "Ready" });
    node.on("input", message => {
      node.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const { data } = constructParameters(
        message,
        configuration,
        node.context(),
        ["data"]
      );
      try {
        send(node, output, message, recordId(data));
      } catch (error) {
        handleError(node, error.message, message);
      }
    });
  }
  RED.nodes.registerType("dapi-record-id", recordId);
};
