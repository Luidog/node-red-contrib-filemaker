module.exports = function(RED) {
  function deleteRecords(config) {
    const { send, handleError, constructParameters } = require("../services");
    const { client, output, ...configuration } = config;

    RED.nodes.createNode(this, config);

    const node = this;

    node.connection = RED.nodes.getNode(client);
    node.status({ fill: "blue", shape: "dot", text: "Loading" });

    node.handleEvent = ({ connected, message }) =>
      node.status(
        connected
          ? { fill: "green", shape: "dot", text: message }
          : { fill: "red", shape: "dot", text: message }
      );

    node.connection.on("status", node.handleEvent);

    node.on("input", async message => {
      this.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const { layout, recordId, ...parameters } = constructParameters(
        message,
        configuration,
        node.context(),
        ["layout", "scripts", "recordId"]
      );
      const client = await this.connection.client;

      client
        ? client
            .delete(layout, recordId, parameters)
            .then(response => send(node, output, message, response))
            .catch(error => handleError(node, error.message, message))
        : handleError(node, "Failed to load DAPI client.", message);
    });
    
    node.on("close", done => {
      node.connection.removeListener("error", node.handleEvent);
      node.connection.removeListener("status", node.handleEvent);
      done();
    });
  }
  RED.nodes.registerType("dapi-delete-record", deleteRecords);
};
