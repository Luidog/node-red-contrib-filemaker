module.exports = function(RED) {
  function globals(config) {
    const { merge, constructParameters } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    this.status({ fill: "green", shape: "dot", text: "Ready" });
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async message => {
      this.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const connection = await this.connection.client;
      const { data } = constructParameters(
        message,
        configuration,
        node.context(),
        ["data"]
      );
      connection
        .globals(data)
        .then(response => send(node, output, message, response))
        .catch(error => handleError(node, error.message, message));
    });
  }
  RED.nodes.registerType("dapi-set-globals", globals);
};
