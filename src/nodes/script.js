module.exports = function(RED) {
  function script(config) {
    const { compact, merge, sanitizeParameters } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async msg => {
      const { script, layout, param } = compact([
        sanitizeParameters(configuration, ["layout", "script", "param"]),
        msg.parameters,
        msg.payload
      ]);
      let connection = await this.connection.client
      connection
        .script(layout, script, param)
        .then(response => node.send(merge(msg, response)))
        .catch(error => node.error(error.message, error));
    });
  }
  RED.nodes.registerType("trigger-script", script);
};
