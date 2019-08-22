module.exports = function(RED) {
  function deleteRecords(config) {
    const { send, handleError, constructParameters } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    this.status({ fill: "green", shape: "dot", text: "Ready" });
    const { client, output, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async message => {
      this.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const { layout, recordId, ...parameters } = constructParameters(
        message,
        configuration,
        node.context(),
        ["layout", "scripts", "recordId"]
      );
      const connection = await this.connection.client;
      connection
        .delete(layout, recordId, parameters)
        .then(response => send(node, output, message, response))
        .catch(error => handleError(node, error.message, message));
    });
  }
  RED.nodes.registerType("dapi-delete-record", deleteRecords);
};
