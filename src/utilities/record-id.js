module.exports = function(RED) {
  function recordId(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const { recordId } = require("fms-api-client");
    node.on("input", msg => {
      let data = recordId(msg.payload.data);
      msg.payload = data;
      node.send(msg);
    });
  }
  RED.nodes.registerType("record-id", recordId);
};
