module.exports = function(RED) {
  function find(config) {
    const { send, handleError, constructParameters } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    this.status({ fill: "green", shape: "dot", text: "Ready" });
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async message => {
      this.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const { layout, query, ...parameters } = constructParameters(
        message,
        configuration,
        node.context(),
        [
          "layout",
          "limit",
          "offset",
          "sort",
          "query",
          "scripts",
          "portals",
          "data"
        ]
      );
      const connection = await this.connection.client;
      connection
        .find(layout, query, parameters)
        .then(response => send(node, output, message, response))
        .catch(error => handleError(node, error.message, message));
    });
  }
  RED.nodes.registerType("dapi-perform-find", find);
};
