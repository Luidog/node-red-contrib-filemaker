module.exports = function(RED) {
  function transform(configuration) {
    const { transform } = require("fms-api-client");
    const { merge, constructParameters } = require("../services");
    RED.nodes.createNode(this, configuration);
    const node = this;
    node.on("input", message => {
      let { data, ...parameters } = constructParameters(
        message,
        configuration,
        node.context(),
        ["data"]
      );
      try {
        node.send(
          merge(configuration.output, message, transform(data, parameters))
        );
      } catch (error) {
        node.error(error.message, message);
      }
    });
  }
  RED.nodes.registerType("transform", transform);
};
