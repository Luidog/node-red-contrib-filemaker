module.exports = function(RED) {
  function transform(config) {
    const { transform } = require("fms-api-client");
    const {
      send,
      handleError,
      isJson,
      constructParameters
    } = require("../services");
    const { output } = config;
    RED.nodes.createNode(this, config);

    const node = this;

    node.status({ fill: "green", shape: "dot", text: "Ready" });

    node.on("input", message => {
      node.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const { data, ...parameters } = constructParameters(
        message,
        config,
        node.context(),
        ["data"]
      );
      try {
        if (isJson(data)) {
          send(node, output, message, transform(data, parameters));
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
