module.exports = function(RED) {
  function get(config) {
    const {
      compact,
      merge,
      sanitizeParameters
    } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async msg => {
      const { layout, recordId, ...parameters } = compact([
        sanitizeParameters(configuration, ["layout"]),
        msg.parameters,
        msg.payload
      ]);
      let connection = await this.connection.client;
      connection
        .get(layout, recordId, parameters)
        .then(response => node.send(merge(msg, response)))
        .catch(error => node.error(error.message, msg));
    });
  }
  RED.nodes.registerType("get-record", get);
};
