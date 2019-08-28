module.exports = function(RED) {
  function duplicate(config) {
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

    node.configuration = RED.nodes.getNode(client);
    node.configuration.on("status", node.handleEvent);

    node.on("input", async message => {
      this.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const { layout, recordId, ...parameters } = constructParameters(
        message,
        configuration,
        node.context(),
        ["layout", "recordId", "scripts"]
      );
      try {
        await this.configuration.connection;
        const client = await this.configuration.client;
        client
          .duplicate(layout, recordId, parameters)
          .then(response => send(node, output, message, response))
          .catch(error => handleError(node, error.message, message));
      } catch (error) {
        handleError(node, error.message, message);
      }
    });

    node.on("close", () =>
      node.configuration.removeListener("status", node.handleEvent)
    );
  }
  RED.nodes.registerType("dapi-duplicate", duplicate);
};
