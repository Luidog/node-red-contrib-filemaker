module.exports = function(RED) {
  function create(config) {
    const { compact, merge, sanitize } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);

    node.on("input", async msg => {
      const { layout, data, ...parameters } = compact([
        sanitize(configuration, ["layout", "scripts", "merge"]),
        msg.parameters,
        msg.payload
      ]);
      let connection = await this.connection.client;

      connection
        .create(layout, data, parameters)
        .then(response => node.send(merge(msg, response)))
        .catch(error => node.error(error.message, msg));
    });
  }
  RED.nodes.registerType("create-record", create);
};
