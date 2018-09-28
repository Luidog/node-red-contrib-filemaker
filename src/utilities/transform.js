module.exports = function(RED) {
  function transform(config) {
    const { transform } = require("fms-api-client");
    RED.nodes.createNode(this, config);
    const node = this;
    node.on("input", msg => node.send({ payload: transform(msg.payload) }));
  }
  RED.nodes.registerType("transform", transform);
};
