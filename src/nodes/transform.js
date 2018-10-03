module.exports = function(RED) {
  function transform(config) {
    const { transform } = require("fms-api-client");
    const { merge } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    node.on("input", msg => {
      const parameters = config.parameters || msg.parameters || {};
      return node.send(merge(msg, transform(msg.payload, parameters)));
    });
  }
  RED.nodes.registerType("transform", transform);
};
