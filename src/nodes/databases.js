module.exports = function(RED) {
  function databases(configuration) {
    const { constructParameters, send, handleError } = require("../services");
    RED.nodes.createNode(this, configuration);
    const node = this;
    this.status({ fill: "green", shape: "dot", text: "Ready" });
    const { client, output } = configuration;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async message => {
      this.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const { credentials } = constructParameters(
        message,
        configuration,
        node.context(),
        ["credentials"]
      );

      const connection = await this.connection.client;

      connection
        .databases(credentials)
        .then(response => send(node, output, message, response))
        .catch(error => handleError(node, error.message, message));
    });
  }
  RED.nodes.registerType("dapi-databases", databases);
};
