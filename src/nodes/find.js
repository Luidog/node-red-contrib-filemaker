module.exports = function(RED) {
  function find(config) {
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
      node.status({ fill: "yellow", shape: "dot", text: "Processing" });
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
      const client = await this.connection.client;
      client
        ? client
            .find(layout, query, parameters)
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
  RED.nodes.registerType("dapi-perform-find", find);
};
