module.exports = function(RED) {
  function recordId(config) {
    const { recordId } = require("fms-api-client");
    const { merge } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    node.on("input", msg =>
      node.send(
        merge(
          msg,
          Object.assign(msg.payload, { data: recordId(msg.payload.data) })
        )
      )
    );
  }
  RED.nodes.registerType("recordId", recordId);
};
