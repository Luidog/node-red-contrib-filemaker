module.exports = function(RED) {
  function list(config) {
    const { send, handleError, constructParameters } = require("../services");
    const { client, output, ...configuration } = config;

    RED.nodes.createNode(this, config);

    const node = this;

    node.client = RED.nodes.getNode(client);

    node.status({ fill: "blue", shape: "dot", text: "Loading" });

    node.handleEvent = ({ connected, message }) =>
      node.status(
        connected
          ? { fill: "green", shape: "dot", text: message }
          : { fill: "red", shape: "dot", text: message }
      );

    /* istanbul ignore else  */
    if (node.client) node.client.on("status", node.handleEvent);

    node.on("input", async message => {
      node.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const { layout, ...parameters } = constructParameters(
        message,
        configuration,
        node.context(),
        ["layout", "limit", "offset", "sort", "scripts", "portals"]
      );
      try {
        await this.client.connection;

        const client = await this.client.client;

        client
          .list(layout, parameters)
          .then(response => send(node, output, message, response))
          .catch(error => handleError(node, error.message, message));
      } catch (error) {
        handleError(node, error.message, message);
      }
    });
    node.on("close", () =>
      node.client.removeListener("status", node.handleEvent)
    );
  }
  RED.nodes.registerType("dapi-list-records", list);
};
