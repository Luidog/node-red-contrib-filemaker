module.exports = function(RED) {
  function script(config) {
    const { send, handleError, constructParameters } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    this.status({ fill: "green", shape: "dot", text: "Ready" });
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async message => {
      this.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const { script, layout, parameter } = constructParameters(
        message,
        configuration,
        node.context(),
        ["script", "layout", "parameter"]
      );
      const connection = await this.connection.client;
      connection
        .script(layout, script, parameter)
        .then(response => send(node, output, message, response))
        .catch(error => handleError(node, error.message, message));
    });
  }
  RED.nodes.registerType("dapi-trigger-script", script);
};
