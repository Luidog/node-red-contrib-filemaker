module.exports = function(RED) {
  function fieldData(config) {
    const { fieldData } = require("fms-api-client");
    RED.nodes.createNode(this, config);
    const node = this;
    node.on("input", msg => node.send({ payload: fieldData(msg.payload) }));
  }
  RED.nodes.registerType("fieldData", fieldData);
};
