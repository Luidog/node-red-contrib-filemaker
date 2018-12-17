module.exports = function(RED) {
  function recordId(configuration) {
    const { recordId } = require("fms-api-client");
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
        node.send(merge(configuration.output, message, recordId(data)));
      } catch (error) {
        node.error(error.message, message);
      }
    });
  }
  RED.nodes.registerType("recordId", recordId);
};
