module.exports = function(RED) {
  function recordId(configuration) {
    const { recordId } = require("fms-api-client");
    const { send, handleError, constructParameters } = require("../services");
    RED.nodes.createNode(this, configuration);
    const node = this;
    this.status({ fill: "green", shape: "dot", text: "Ready" });
    node.on("input", message => {
      this.status({ fill: "yellow", shape: "dot", text: "Processing" });
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
