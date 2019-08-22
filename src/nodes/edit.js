module.exports = function(RED) {
  function edit(config) {
    const { send, handleError, constructParameters, castBooleans } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    this.status({ fill: "green", shape: "dot", text: "Ready" });
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async message => {
      const { layout, recordId, data, ...parameters } = constructParameters(
        message,
        configuration,
        node.context(),
        ["layout", "scripts", "data", "merge", "recordId"]
      );
      const connection = await this.connection.client;
      connection
        .edit(layout, recordId, data, castBooleans(parameters))
        .then(response => send(node, output, message, response))
        .catch(error => handleError(node, error.message, message));
    });
  }
  RED.nodes.registerType("dapi-edit-record", edit);
};
