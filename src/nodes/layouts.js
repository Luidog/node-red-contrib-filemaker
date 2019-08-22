module.exports = function(RED) {
  function layouts(configuration) {
    const { send, handleError } = require("../services");
    RED.nodes.createNode(this, configuration);
    const node = this;
    this.status({ fill: "green", shape: "dot", text: "Ready" });
    const { client } = configuration;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async message => {
      this.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const connection = await this.connection.client;
      client
        .layouts()
        .then(response => send(node, output, message, response))
        .catch(error => handleError(node, error.message, message));
    });
  }
  RED.nodes.registerType("dapi-layouts", layouts);
};
