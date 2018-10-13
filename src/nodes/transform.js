module.exports = function(RED) {
  function transform(config) {
    const { transform } = require("fms-api-client");
    const { merge, parse } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    node.on("input", msg => {
      const parameters = config.parameters || msg.parameters || {};
      node.send(
        merge(
          msg,
          Object.assign(
            { data: transform(msg.payload.data, parse(parameters)) },
            msg.payload
          )
        )
      );
    });
  }
  RED.nodes.registerType("transform", transform);
};
