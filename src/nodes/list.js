module.exports = function(RED) {
  function list(config) {
    this.status({ fill: "green", shape: "dot", text: "Ready" });
    const { send, handleError, constructParameters } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async message => {
      this.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const { layout, ...parameters } = constructParameters(
        message,
        configuration,
        node.context(),
        ["layout", "limit", "offset", "sort", "scripts", "portals"]
      );

      const connection = await this.connection.client;
      connection
        .list(layout, parameters)
        .then(response => send(node, output, message, response))
        .catch(error => handleError(node, error.message, message));
    });
  }
  RED.nodes.registerType("dapi-list-records", list);
};
