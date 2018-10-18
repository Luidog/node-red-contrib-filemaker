module.exports = function(RED) {
  function fieldData(config) {
    const { fieldData } = require("fms-api-client");
    const { merge } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    node.on("input", msg =>
      node.send(
        merge(
          msg,
          Object.assign(msg.payload, { data: fieldData(msg.payload.data) })
        )
      )
    );
  }
  RED.nodes.registerType("fieldData", fieldData);
};
