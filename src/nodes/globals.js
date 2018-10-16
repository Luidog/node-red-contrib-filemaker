module.exports = function(RED) {
  function globals(config) {
    const { merge } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", msg => {
      const data = configuration.globals || msg.payload;
      let connection = await this.connection.client
      connection
        .globals(data)
        .then(response => node.send(merge(msg, response)))
        .catch(error => node.error(error.message, error));
    });
  }
  RED.nodes.registerType("set-globals", globals);
};
