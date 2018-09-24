module.exports = function(RED) {
  function fieldData(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const { fieldData } = require("fms-api-client");
    node.on("input", msg => {
      let data = fieldData(msg.payload.data);
      msg.payload = data;
      node.send(msg);
    });
  }
  RED.nodes.registerType("field-data", fieldData);
};
