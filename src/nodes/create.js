module.exports = function(RED) {
  function create(config) {
    const {
      constructParameters,
      castBooleans,
      send,
      handleError
    } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    this.status({ fill: "green", shape: "dot", text: "Ready" });
    node.connection = RED.nodes.getNode(client);
    node.on("input", async message => {
      this.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const { layout, data, ...parameters } = constructParameters(
        message,
        configuration,
        node.context(),
        ["layout", "scripts", "data", "merge"]
      );
      const { output } = configuration;
      const connection = await this.connection.client;
      connection
        .create(layout, data || {}, castBooleans(parameters))
        .then(response => send(node, output, message, response))
        .catch(error => handleError(node, error.message, message));
    });
  }
  RED.nodes.registerType("dapi-create-record", create);
};
