module.exports = function(RED) {
  function create(config) {
    const {
      constructParameters,
      castBooleans,
      send,
      handleError
    } = require("../services");

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

    node.connection = RED.nodes.getNode(client);
    node.connection.on("status", node.handleEvent);

    node.on("input", async message => {
      this.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const { layout, data, ...parameters } = constructParameters(
        message,
        configuration,
        node.context(),
        ["layout", "scripts", "data", "merge"]
      );

      const client = await this.connection.client;

      client
        ? client
            .create(layout, data || {}, castBooleans(parameters))
            .then(response => send(node, output, message, response))
            .catch(error => handleError(node, error.message, message))
        : handleError(node, "Failed to load DAPI client.", message);
    });
  }
  RED.nodes.registerType("dapi-create-record", create);
};
