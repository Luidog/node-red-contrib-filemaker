module.exports = function(RED) {
  function layout(configuration) {
    const { send, handleError, constructParameters } = require("../services");
    RED.nodes.createNode(this, configuration);
    const node = this;
    this.status({ fill: "green", shape: "dot", text: "Ready" });
    const { client } = configuration;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async message => {
      this.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const { layout } = constructParameters(
        message,
        configuration,
        node.context(),
        ["layout"]
      );
      const connection = await this.connection.client;
      connection
        .layout(layout)
        .then(response => send(node, output, message, response))
        .catch(error => handleError(node, error.message, message));
    });
  }
  RED.nodes.registerType("dapi-layout", layout);
};
