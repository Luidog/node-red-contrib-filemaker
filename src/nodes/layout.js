module.exports = function(RED) {
  function layout(config) {
    const { send, handleError, constructParameters } = require("../services");
    const { client, output, ...configuration } = config;
    RED.nodes.createNode(this, config);

    const node = this;

    node.status({ fill: "blue", shape: "dot", text: "Loading" });
    node.handleEvent = ({ connected, message }) =>
      node.status(
        connected
          ? { fill: "green", shape: "dot", text: message }
          : { fill: "red", shape: "dot", text: message }
      );

    node.client = RED.nodes.getNode(client);
    node.on("input", async message => {
      this.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const { layout } = constructParameters(
        message,
        configuration,
        node.context(),
        ["layout"]
      );

      const client = await this.client.connection;

      client
        ? client
            .layout(layout)
            .then(response => send(node, output, message, response))
            .catch(error => handleError(node, error.message, message))
        : handleError(node, "Failed to load DAPI client.", message);

      node.on("close", () =>
        node.client.removeListener("status", node.handleEvent)
      );
    });
  }
  RED.nodes.registerType("dapi-layout", layout);
};
